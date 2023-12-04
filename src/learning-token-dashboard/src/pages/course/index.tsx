import { useEffect, useState } from "react";
import { initWeb3Method } from "../../utils";
import { Table } from "rsuite";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const { Column, HeaderCell, Cell } = Table;
const Course = () => {
  const [courseIdOptions, setCourseIdOptions] = useState([]);
  const auth = useSelector((state: RootState) => state.auth);

  const getCourse = async () => {
    const contract = await initWeb3Method();
    const courseLength = await contract!.courseId();

    let temp: any = [];
    if (Number(courseLength) > 0) {
      for (let index = 0; index < Number(courseLength); index++) {
        const tx = await contract!.courses(index);
        let obj = { value: 0, label: "" };
        for (let key in tx) {
          if (+key === 3 && auth.user.publicAddress) {
            obj.value = index + 1;
          }
          if (+key === 5) {
            obj.label = tx[key];
          }
        }
        if (obj.value !== 0) {
          temp.push(obj);
        }
      }
    }
    setCourseIdOptions(temp);
  };

  useEffect(() => {
    getCourse();
  }, []);

  return (
    <div className="py-3">
      <Table data={courseIdOptions} autoHeight rowClassName={"cursor-pointer"}>
        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="value" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Course Name</HeaderCell>
          <Cell dataKey="label" className="capitalize" />
        </Column>
      </Table>
    </div>
  );
};

export default Course;
