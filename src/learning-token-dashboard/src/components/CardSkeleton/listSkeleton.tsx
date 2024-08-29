import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ListSkeleton = ({ _height }: { _height: number }) => {
    const cards = new Array(5).fill(0);
    const rows = new Array(4).fill(0); 
    return (
        <div>
            <div className="flex mb-4">
                {cards.map((_, index) => (
                    <div key={index} className="w-1/5 mr-2">
                        <Skeleton height={_height} width={`100%`} />
                    </div>
                ))}
            </div>

            {rows.map((_, rowIndex) => (
                <div key={rowIndex} className='flex mt-2'>
                    {cards.map((_, index) => (
                        <div key={index} className="w-1/5 mr-2">
                            <Skeleton height={_height - 10} width={`100%`} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default ListSkeleton