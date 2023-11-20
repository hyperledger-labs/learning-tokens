import { useEffect, useState } from "react";
import { initWeb3Method } from "../../utils";
import { Table } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
const Course = () => {
  const [courseIdOptions, setCourseIdOptions] = useState([]);
  
  const getCourse = async () => {
    const contract = await initWeb3Method();
    const tx = await contract!.getCoursesBySender();
    console.log(tx);
    
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
