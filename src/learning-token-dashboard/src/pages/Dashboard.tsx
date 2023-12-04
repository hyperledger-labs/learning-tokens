import { useSelector } from "react-redux";
import { RootState } from "../store";
import { initWeb3Method } from "../utils";
// import { number, object } from "yup";
// import { FormikProps } from "formik";
import { useEffect, useState } from "react";

import Token from "../components/nft/Token";

// const initialValues = {
//   tokenId: 0,
// };

// const validationSchema = object().shape({
//   tokenId: number().required("Please provide a valid token ID"),
// });

function Dashboard() {
  const auth = useSelector((state: RootState) => state.auth);
  // const formikRef = useRef<FormikProps<any>>(null);
  // const [balance, setBalance] = useState<any>(null);
  // const [courseIdOptions, setCourseIdOptions] = useState([]);

  const [tokens, setTokens] = useState([])


  const getLearnerTokenMetadata = async () => {
    const contract = await initWeb3Method()
    const tx = await contract!.getLearnerTokenMetadata(auth.user.publicAddress)
  
    let temp: any = [];
    for (let key in tx) {
      if (tx.hasOwnProperty(key)) {
        if (Array.isArray(tx[key])) {          
          let obj: any = {};
          tx[key].forEach((item: any, index: number) => {
            if (index === 0) {
              obj["institutionId"] = Number(item);
            }
            if (index === 1) {
              obj["instructorId"] = Number(item);
            }
            if (index === 2) {
              obj["tokenId"] = Number(item);
            }
            if (index === 3) {
              obj["createdAt"] = Number(item);
            }
            if (index === 4) {
              obj["courseId"] = Number(item);
            }
            if (index === 5) {
              obj["fieldOfKnowledge"] = (item);
            }
            if (index === 6) {
              obj["skill"] = (item);
            }
          
          });
          temp.push(obj);
        } 
      }
    }

    if (temp.length > 0) {
      setTokens(temp)
    }
  } 

  useEffect(() => {
    if (auth.user.type === "learner") {
      getLearnerTokenMetadata()
    }
  }, []);


  


  if (auth.user.type === "learner") {
    return (
      <>
        <div className="flex flex-col items-center">
          <h3 className="font-bold">Your Tokens</h3>
          <div className="grid grid-cols-4 gap-2">
            {
              tokens.length > 0 && tokens.map((token:any,index:number) => {
                return <Token key={index} item={token}/>
              })
            }
          </div>

        </div>


        {/* <div className="flex flex-col items-center justify-center w-full">
          <h3>
            Check your token balance - <span>{balance ? balance : "__"}</span>
          </h3>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formikRef}
            onSubmit={handleSubmit}
            >
            <Form>
              <TextInput
                name="tokenId"
                type="text"
                label="Token ID"
                containerStyle={`w-full`}
                size="small"
              />
              <Button
                size="small"
                className="w-full"
                variant="primary"
                type="submit"
                >
                Check
              </Button>
            </Form>
          </Formik>
        </div> */}
    
      </>
    );
  }

  return (
    <>
      <div className="font-bold text-lg">
        Hello <span className="capitalize">{auth.user.name}</span>
      </div>
    </>
  );
}

export default Dashboard;
