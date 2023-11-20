import { ethers } from "ethers";
import { Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import Button from "../../components/Button";
import SelectInput from "../../components/SelectInput";
import TextInput from "../../components/TextInput";
import { useGetInstitutionQuery } from "../../store/features/admin/adminApi";
import { initWeb3Method } from "../../utils";
import toast from "react-hot-toast";
const initialValues = {
  courseId: "",
  institutionId: "",
  instructorId: "",
  fieldOfKnowledge: "",
  skillName: "",
  institutionAddress: "",
};

const validationSchema = object().shape({
  courseId: string().required("This field is required."),
  institutionId: string().required("This field is required."),
  instructorId: string().required("This field is required."),
  fieldOfKnowledge: string().required("This field is required."),
  skillName: string().required("This field is required."),
  institutionAddress: string().required("This field is required."),
});

const SetToken = () => {
  const [courseIdOptions, setCourseIdOptions] = useState([]);
  const [instructorIdOptions, setInstructorIdOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const formikRef = useRef<FormikProps<any>>(null);
  const { data: institutionList } = useGetInstitutionQuery();
  const handleSubmit = async (values: any) => {
    const contract = await initWeb3Method();
    const insId = await setinstitutionId(values.institutionId);
    const tx = await contract!.setTokenMetadata(
      values.courseId,
      insId,
      values.instructorId,
      values.fieldOfKnowledge,
      values.skillName,
      values.institutionAddress,
      Date.now()
    );
    if (tx) {
      toast.success("Token Metadata Updated");
    }
  };

  useEffect(() => {
    getCourse();
    getInstructors();
    meta();
  }, []);

  const getCourse = async () => {
    const contract = await initWeb3Method();
    const tx = await contract!.getCoursesBySender();
    let temp: any = [];
    for (let key in tx) {
      if (tx.hasOwnProperty(key)) {
        if (Array.isArray(tx[key])) {
          let obj: any = {};
          tx[key].forEach((item: any, index: number) => {
            if (index === 1) {
              obj["value"] = Number(item);
            } else {
              obj["label"] = item;
            }
          });

          temp.push(obj);
        } else {
        }
      }
    }

    setCourseIdOptions(temp);
  };

  const getInstructors = async () => {
    const contract = await initWeb3Method();
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const tx = await contract!.instructors(address);
    setInstructorIdOptions([{ value: Number(tx[0]), label: tx[1] }]);
  };

  const setinstitutionId = async (address: string) => {
    const contract = await initWeb3Method();
    const tx = await contract!.institutions(address);
    return Number(tx[0]);
  };

  const meta = async () => {
    const contract = await initWeb3Method();
    const tx = await contract!.tokenMetadatas(0);
    console.log(tx);
  };

  return (
    <div className="w-[800px] mx-auto my-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        innerRef={formikRef}
        onSubmit={handleSubmit}
      >
        <Form className="flex flex-col items-center justify-between">
          <SelectInput
            name="courseId"
            label="Course ID"
            containerStyle={`w-full`}
            size="small"
            options={courseIdOptions || []}
          />
          <SelectInput
            name="instructorId"
            label="Instructor ID"
            containerStyle={`w-full`}
            size="small"
            options={instructorIdOptions || []}
          />
          <SelectInput
            name="institutionId"
            label="Institution ID"
            containerStyle={`w-full`}
            size="small"
            options={
              institutionList?.result?.data.map((i: any) => {
                return {
                  value: i.publicAddress,
                  label: i.name + " - " + i.publicAddress,
                };
              }) || []
            }
          />
          <TextInput
            name="fieldOfKnowledge"
            type="text"
            label="Field Of Knowledge"
            containerStyle={`w-full`}
            size="small"
          />
          <TextInput
            name="skillName"
            type="text"
            label="Skill Name"
            containerStyle={`w-full`}
            size="small"
          />

          <SelectInput
            name="institutionAddress"
            label="Institution Address"
            containerStyle={`w-full`}
            size="small"
            options={
              institutionList?.result?.data.map((i: any) => {
                return {
                  value: i.publicAddress,
                  label: i.name + " - " + i.publicAddress,
                };
              }) || []
            }
          />
          <Button
            size="small"
            className="w-full"
            variant="primary"
            type="submit"
          >
            Set Token
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default SetToken;
