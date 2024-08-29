import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SquareSkeleton = ({ _height }: { _height: number }) => {
    const squares = new Array(3).fill(0); 
    const rows = new Array(4).fill(0); 
    return (
        <div>
            {rows.map((_, rowIndex) => (
                <div key={rowIndex} className='flex justify-between mt-2'>
                    {squares.map((_, index) => (
                        <div key={index} className="w-1/3 mr-2">
                            <Skeleton height={_height} width={`100%`} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default SquareSkeleton