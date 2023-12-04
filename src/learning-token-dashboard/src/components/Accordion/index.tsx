import {FC, useRef} from 'react'
import {BiChevronDown} from 'react-icons/bi'
type Props = {
    data: {
        id: number
        name: String
    }
    active: number
    handleToggle: (index: number) => void
    children?: JSX.Element
}
const AccordionItem: FC<Props> = ({data, active, handleToggle, children}) => {
    const detailsRef = useRef<HTMLDivElement>(null)
    const {id, name} = data
    return (
        <div>
            <div
                className={`flex items-center justify-between gap cursor-pointer py-3 px-6 rounded-lg hover:text-white hover:bg-[#013A44]`}
                onClick={() => handleToggle(data.id)}
            >
                {name}
                <span
                    className={`transition-all duration-200 ml-4 ${
                        active === id ? `rotate-180` : `rotate-0`
                    }`}
                >
                    <BiChevronDown />
                </span>
            </div>
            <div
                ref={detailsRef}
                className={`relative overflow-hidden transition-all duration-200 ${
                    active === id ? `h-auto` : `h-0`
                }`}
                style={active === id ? {height: detailsRef.current?.scrollHeight} : {height: '0px'}}
            >
                {children}
            </div>
        </div>
    )
}

export default AccordionItem
