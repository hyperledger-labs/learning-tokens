import { FC, useEffect, useState } from "react";
import { formatDate, initWeb3Method } from "../../utils";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { SmartcontractFunctionsEnum } from "../../enums/smartcontract-functions.enum";
import axios from "axios";
import { Card } from "react-bootstrap";

type ItemProps = {
  institutionId: number;
  instructorId: number;
  tokenId: number;
  createdAt: string;
  courseId: number;
  fieldOfKnowledge: string;
  skill: string;
};

type Props = {
  item: ItemProps;
};

const Token: FC<Props> = ({ item }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [amount, setAmount] = useState<number | null>(null);

  const getAmount = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/smartcontract/register-actor`, {
        role: auth.user.role,
        id: auth.user.id,
        functionName: SmartcontractFunctionsEnum.BALANCE_OF,
        params: [auth.user.publicAddress, item.tokenId],
      }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      const tokenBalance = response?.data?.result || 0;
      setAmount(Number(tokenBalance));
    } catch (error) {
      console.error("Error invoking balanceOf:", error);
    }
  };

  useEffect(() => {
    getAmount();
  }, []);

  return (
    <Card className="mb-3" style={{ width: '330px', height: '300px' }}>
      <Card.Header className="text-center bg-[#013A44] text-black font-bold">
        LTN
      </Card.Header>
      <Card.Body className="bg-[#013A44] text-white">
        <div className="d-flex justify-content-between align-items-center mb-3 ml-5">
          <span className="font-bold">Amount: {amount} LTN</span>
        </div>
        <div className="d-flex flex-wrap gap-1 mb-3 ml-5">
          <span className="bg-slate-600 rounded-lg py-1 px-2">
            Field of Knowledge : {item.fieldOfKnowledge}
          </span>
        </div>
        <div className="d-flex flex-wrap gap-1 mb-3 ml-5">
          <span className="bg-lime-700 rounded-lg py-1 px-2">
            Skill: {item.skill}
          </span>
        </div>
        <div className="text-white ml-5">
          Created: {item.createdAt}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Token;
