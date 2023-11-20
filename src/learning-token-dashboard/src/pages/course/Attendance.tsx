import { Form, Formik, FormikProps } from "formik";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { array, number, object, string } from "yup";
import Button from "../../components/Button";
import SelectInput from "../../components/SelectInput";
import { initWeb3 } from "../../utils";
import toast from "react-hot-toast";
const initialValues = {
  token_type: "attendance_token",
  attendance: null,
};

const validationSchema = object().shape({
  token_type: string().required("Please select an institution"),
  attendance: array()
    .of(
      object().shape({
        courseId: number(),
        amount: number(),
        learnerId: number(),
        fieldOfKnowledge: string(),
        skillName: string(),
      })
    )
    .required("At least 1 attendance should be added"),
});
const Attendance = () => {
  const formikRef = useRef<FormikProps<any>>(null);

  const handleSubmit = async (values: any) => {
    const contract = await initWeb3();

    if (values.token_type === "attendance_token") {
      const [_attendance] = values.attendance;
      const tx = await contract!.mintAttendanceToken(
        _attendance.learnerId,
        _attendance.amount,
        _attendance.courseId,
        Date.now(),
        _attendance.fieldOfKnowledge,
        _attendance.skillName
      );
      if (tx) {
        toast.success("Attendance Token minted");
      }
    }
    if (values.token_type === "batch_attendance_token") {
      const [_attendance] = values.attendance;
      const _learnerIds: number[] = [];
      const _amounts: number[] = [];

      values.attendance.map((item: any) => {
        _learnerIds.push(item.learnerId);
        _amounts.push(item.amount);
      });

      const tx = await contract!.batchMintAttendanceToken(
        _learnerIds,
        _amounts,
        _attendance.courseId,
        Date.now(),
        _attendance.fieldOfKnowledge,
        _attendance.skillName
      );
      if (tx) {
        toast.success("Batch Attendance Token minted");
      }
    }
    if (values.token_type === "helping_token") {
      const [_attendance] = values.attendance;
      const tx = await contract!.mintHelpingToken(
        _attendance.learnerId,
        _attendance.amount,
        _attendance.courseId,
        Date.now(),
        _attendance.fieldOfKnowledge,
        _attendance.skillName
      );
      if (tx) {
        toast.success("Helping Token minted");
      }
    }
    if (values.token_type === "batch_helping_token") {
      const [_attendance] = values.attendance;
      const _learnerIds: number[] = [];
      const _amounts: number[] = [];

      values.attendance.map((item: any) => {
        _learnerIds.push(item.learnerId);
        _amounts.push(item.amount);
      });

      const tx = await contract!.batchMintHelpingToken(
        _learnerIds,
        _amounts,
        _attendance.courseId,
        Date.now(),
        _attendance.fieldOfKnowledge,
        _attendance.skillName
      );
      if (tx) {
        toast.success("Batch Helping Token minted");
      }
    }
    if (values.token_type === "score_token") {
      const tx = await contract!.mintScoreToken(
        values.attendance.learnerId,
        values.attendance.amount,
        values.attendance.courseId,
        Date.now(),
        values.attendance.fieldOfKnowledge,
        values.attendance.skillName
      );

      if (tx) {
        toast.success("Score Token minted");
      }
    }
    if (values.token_type === "batch_score_token") {
      const [_attendance] = values.attendance;
      const _learnerIds: number[] = [];
      const _amounts: number[] = [];

      values.attendance.map((item: any) => {
        _learnerIds.push(item.learnerId);
        _amounts.push(item.amount);
      });
      const tx = await contract!.batchMintScoreToken(
        _learnerIds,
        _amounts,
        _attendance.courseId,
        Date.now(),
        _attendance.fieldOfKnowledge,
        _attendance.skillName
      );

      if (tx) {
        toast.success("Batch Score Token minted");
      }
    }
    if (values.token_type === "instructorScore_token") {
      const [_attendance] = values.attendance;
      const tx = await contract!.mintInstructorScoreToken(
        _attendance.learnerId,
        _attendance.amount,
        _attendance.courseId,
        Date.now(),
        _attendance.fieldOfKnowledge
      );

      if (tx) {
        toast.success("Instructor Token minted");
      }
    }
    if (values.token_type === "batch_instructorScore_token") {
      const [_attendance] = values.attendance;
      const _learnerIds: number[] = [];
      const _amounts: number[] = [];

      values.attendance.map((item: any) => {
        _learnerIds.push(item.learnerId);
        _amounts.push(item.amount);
      });
      const tx = await contract!.batchMintInstructorScoreToken(
        _learnerIds,
        _amounts,
        _attendance.courseId,
        Date.now(),
        _attendance.fieldOfKnowledge
      );

      if (tx) {
        toast.success("Batch Instructor Token minted");
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

          let learnerAddress;
          switch (formik.values.token_type) {
            case "attendance_token":
              learnerAddress = jsonData.map((learner: any) => {
                return {
                  courseId: learner.courseId,
                  amount: learner.amount,
                  learnerId: learner.learnerId,
                  fieldOfKnowledge: learner.fieldOfKnowledge,
                  skillName: learner.skillName,
                };
              });
              formik.setFieldValue("attendance", learnerAddress);
              break;
            case "batch_attendance_token":
              learnerAddress = jsonData.map((learner: any) => {
                return {
                  courseId: learner.courseId,
                  amount: learner.amount,
                  learnerId: learner.learnerId,
                  fieldOfKnowledge: learner.fieldOfKnowledge,
                  skillName: learner.skillName,
                };
              });
              formik.setFieldValue("attendance", learnerAddress);
              break;
            case "helping_token":
              learnerAddress = jsonData.map((learner: any) => {
                return {
                  courseId: learner.courseId,
                  amount: learner.amount,
                  learnerId: learner.learnerId,
                  fieldOfKnowledge: learner.fieldOfKnowledge,
                  skillName: learner.skillName,
                };
              });
              formik.setFieldValue("attendance", learnerAddress);
              break;
            case "batch_helping_token":
              learnerAddress = jsonData.map((learner: any) => {
                return {
                  courseId: learner.courseId,
                  amount: learner.amount,
                  learnerId: learner.learnerId,
                  fieldOfKnowledge: learner.fieldOfKnowledge,
                  skillName: learner.skillName,
                };
              });
              formik.setFieldValue("attendance", learnerAddress);
              break;
            case "score_token":
              learnerAddress = jsonData.map((learner: any) => {
                return {
                  courseId: learner.courseId,
                  amount: learner.amount,
                  learnerId: learner.learnerId,
                  fieldOfKnowledge: learner.fieldOfKnowledge,
                  skillName: learner.skillName,
                };
              });
              formik.setFieldValue("attendance", learnerAddress);
              break;
            case "batch_score_token":
              learnerAddress = jsonData.map((learner: any) => {
                return {
                  courseId: learner.courseId,
                  amount: learner.amount,
                  learnerId: learner.learnerId,
                  fieldOfKnowledge: learner.fieldOfKnowledge,
                  skillName: learner.skillName,
                };
              });
              formik.setFieldValue("attendance", learnerAddress);
              break;
            case "instructorScore_token":
              learnerAddress = jsonData.map((learner: any) => {
                return {
                  courseId: learner.courseId,
                  amount: learner.amount,
                  learnerId: learner.learnerId,
                  fieldOfKnowledge: learner.fieldOfKnowledge,
                };
              });
              formik.setFieldValue("attendance", learnerAddress);
              break;
            case "batch_instructorScore_token":
              learnerAddress = jsonData.map((learner: any) => {
                return {
                  courseId: learner.courseId,
                  amount: learner.amount,
                  learnerId: learner.learnerId,
                  fieldOfKnowledge: learner.fieldOfKnowledge,
                };
              });
              formik.setFieldValue("attendance", learnerAddress);
              break;

            default:
              break;
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const tokenType = [
    { value: "attendance_token", label: "Attendance Token" },
    { value: "batch_attendance_token", label: "Batch Attendance Token" },
    { value: "helping_token", label: "Helping Token" },
    { value: "batch_helping_token", label: "Batch Helping Token" },
    { value: "score_token", label: "Score Token" },
    { value: "batch_score_token", label: "Batch Score Token" },
    { value: "instructorScore_token", label: "Instructor Score Token" },
    {
      value: "batch_instructorScore_token",
      label: "Batch Instructor Score Token",
    },
  ];

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
            <SelectInput
              containerStyle={"w-full"}
              label="Token"
              size="small"
              name="token_type"
              options={tokenType}
            />
            <div className="flex flex-col">
              <label className="inline-block mb-1 text-xs text-gray-500 false">
                Please upload documents accordingly
              </label>
              <div className="flex items-center justify-center border border-dashed py-3 rounded">
                <input
                  className="my-3"
                  type="file"
                  name="attendance"
                  onChange={(event) => handleFileChange(event, formik)}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                />
              </div>
            </div>
            <Button
              size="small"
              className="w-full mt-3"
              variant="primary"
              type="submit"
            >
              Distribute
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Attendance;
