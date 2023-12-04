import { Form, Formik, FormikProps } from "formik";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { array, object, string } from "yup";
import Button from "../../components/Button";
import SelectInput from "../../components/SelectInput";
import TextInput from "../../components/TextInput";
import { useGetInstitutionQuery } from "../../store/features/admin/adminApi";
import { getRandomFileName, initWeb3 } from "../../utils";
import toast from "react-hot-toast";
import axios from "axios";

const JWT = import.meta.env.VITE_PINATA_API_KEY;
const PINTAURL = import.meta.env.VITE_PINATA_URL;

const initialValues = {
  courseName: "",
  institution_address: "",
  scoringGuideGradingPolicyBook: "",
  learnerAddress: [],
};

const validationSchema = object().shape({
  courseName: string().required("Name is required."),
  institution_address: string().required("Please select an institution"),
  learnerAddress: array().min(1).required("At least 1 learner should be added"),
  scoringGuideGradingPolicyBook: string().required(
    "Please upload the file properly"
  ),
});

const CourseNew = () => {  
  const formikRef = useRef<FormikProps<any>>(null);
  const [uploading, setUploading] = useState(false);

  const { data: institutionList, isLoading } = useGetInstitutionQuery();

  const handleSubmit = async (values: any) => {
    const contract = await initWeb3();
    const tx = await contract!.createCourse(
      values.institution_address,
      values.courseName,
      Date.now(),
      values.learnerAddress,
      values.scoringGuideGradingPolicyBook
    );
    if (tx) {
      toast.success("Course Created");
    }
  };

  const handlePinataUpload = (e: any, formik: any) => {
    const fileName = getRandomFileName();
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const pinataMetadata = JSON.stringify({
        name: fileName,
      });
      formData.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", pinataOptions);

      try {
        setUploading(true);
        axios
          .post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
              "Content-Type": `multipart/form-data;`,
              Authorization: `Bearer ${JWT}`,
            },
          })
          .then((res) => {
            setUploading(false);
            toast.success("file is uploaded to IPFS");
            formik.setFieldValue('scoringGuideGradingPolicyBook', PINTAURL+res.data.IpfsHash)
          });
      } catch (error) {
        toast.error("There was a problem on uploading the file to IPFS");
      }
    }
  };

  const handleFileChange = (e: any, formik: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result instanceof ArrayBuffer) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          const learnerAddress = jsonData.map(
            (learner: any) => learner.learner_wallet
          );
          formik.setFieldValue("learnerAddress", learnerAddress);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="w-[800px] mx-auto my-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        innerRef={formikRef}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="flex flex-col justify-between">
            <TextInput
              name="courseName"
              type="text"
              label="Course Name"
              containerStyle={`w-full`}
              size="small"
            />
            <SelectInput
              containerStyle={"w-full"}
              label="Institution"
              size="small"
              name="institution_address"
              options={
                institutionList?.result?.data.map((i: any) => {
                  return {
                    value: i.publicAddress,
                    label: i.name + " - " + i.publicAddress,
                  };
                }) || []
              }
              isLoading={isLoading}
            />
            <div className="flex flex-col">
              <label className="inline-block mb-1 text-xs text-gray-500 false">
                Please upload learner address documents
              </label>
              <div className="flex items-center justify-center border border-dashed py-3 rounded">
                <input
                  type="file"
                  name="learnerAddress"
                  onChange={(event) => handleFileChange(event, formik)}
                  className="my-3"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </div>
            </div>
            <div className="flex flex-col mt-3">
              <label className="inline-block mb-1 text-xs text-gray-500 false">
                Please upload scoring Guide Grading Policy Book documents
              </label>
              <div className="flex items-center justify-center border border-dashed py-3 rounded">
                <input
                  type="file"
                  name="scoringGuideGradingPolicyBook"
                  onChange={(event) => handlePinataUpload(event, formik)}
                  className="my-3"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </div>
              { uploading && 
                <div className="bg-green-300 text-[#013A44] rounded p-3 mt-2 relative">
                  <div className="absolute top-0 left-0 h-full w-1 bg-[#013A44]"></div>
                  <div>Your file is being uploaded to IPFS please wait...</div>
                </div>
              }
            </div>
            <Button
              size="small"
              className="w-full mt-3"
              variant="primary"
              type="submit"
            >
              Add Course
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CourseNew;
