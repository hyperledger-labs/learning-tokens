import { useSelector } from "react-redux";
import { RootState } from "../store";
// import { number, object } from "yup";
// import { FormikProps } from "formik";
import { useEffect, useState } from "react";
import Token from "../components/nft/Token";
import { SmartcontractFunctionsEnum } from "../enums/smartcontract-functions.enum";
import axios from "axios";
import { Spinner } from 'react-bootstrap';
import { formatDateTime } from "../utils";

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
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const [tokens, setTokens] = useState([]);

  const getLearnerTokenMetadata = async () => {
    try {
      setLoadingSpinner(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/smartcontract/register-actor`, {
        role: auth.user.role,
        id: auth.user.id,
        functionName: SmartcontractFunctionsEnum.GET_LEARNER_TOKEN_METADATA,
        params: [auth.user.publicAddress],
      }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      const tokenData = response?.data?.result || [];
      const temp = tokenData.map((item: any) => {
        return {
          institutionId: item[0],
          instructorId: item[1],
          tokenId: item[2],
          createdAt: formatDateTime(new Date(Number(item[3]) * 1000)),
          courseId: item[4],
          fieldOfKnowledge: item[5],
          skill: item[6],
        };
      });

      if (temp.length > 0) {
        setTokens(temp);
      }
    } catch (error) {
      console.error("Error invoking getLearnerTokenMetadata:", error);
    } finally {
      setLoadingSpinner(false);
    }
  };

  useEffect(() => {
    if (auth.user.role === "learner") {
      getLearnerTokenMetadata();
    }
  }, []);

  if (auth.user.role === "learner") {
    return (
      <>
        <div className="font-bold text-lg">
          Hello <span className="capitalize">{auth.user.name}</span>
          <div>
            Public Address: <span>{auth.user.publicAddress}</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-2">
          <h4 className="font-bold">Your Tokens</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {loadingSpinner ? (
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            ) : (tokens.map((token: any) => (
              <Token key={`${token.tokenId}-${auth.user.id}`} item={token} />
            ))
            )}
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
        <div>
          Public Address: <span>{auth.user.publicAddress}</span>
        </div>
      </div>
    </>
  );
}

export default Dashboard;