import { FC, useEffect, useState } from "react";
import { formatDate, initWeb3Method } from "../../utils";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { SmartcontractFunctionsEnum } from "../../enums/smartcontract-functions.enum";
import axios from "axios";

type ItemProps = {
  institutionId: number;
  instructorId: number;
  tokenId: number;
  createdAt: any;
  courseId: number;
  fieldOfKnowledge: string;
  skill: string;
};

type Props = {
  item: ItemProps;
};

const Token: FC<Props> = ({ item }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [amount, setAmount] = useState<any>(null);

  const getAmount = async () => {
    const contract = await initWeb3Method();
    const tx = await contract!.balanceOf(auth.user.publicAddress, item.tokenId);

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
    <div className="w-80 group cursor-pointer">
      <div className="h-52 bg-[#013A44]/10 transition-all duration-300 ease-in-out cursor-pointer group-hover:text-white font-bold group-hover:bg-[#013A44] flex items-center justify-center">
        LTN
      </div>
      <div className="bg-[#013A44] group-hover:bg-[#013A44]/10 px-1 py-3 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between text-xs ">
          <div className="transition-all duration-300 ease-in-out text-white group-hover:text-inherit">
            <span className="font-bold">Amount: </span>
            {amount}LTN
          </div>
          <div className="flex flex-wrap gap-1">
            <div className="bg-slate-600 text-white rounded-lg py-1 px-2">
              {item.fieldOfKnowledge}
            </div>
            <div className="bg-lime-700-100 text-white rounded-lg py-1 px-2">
              {item.skill}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mt-1">
          <div className="text-[10px] text-white group-hover:text-inherit transition-all duration-300 ease-in-out">
            Created: {formatDate(item.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Token;
