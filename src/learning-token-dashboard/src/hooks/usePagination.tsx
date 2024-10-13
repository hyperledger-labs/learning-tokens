import {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

const usePagination = (pageValue = 1, limitValue = 12) => {
    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)

    const [page, setPage] = useState<number>(Number(searchParams.get('page')) || pageValue)
    const [limit, setLimit] = useState<number>(Number(searchParams.get('limit')) || limitValue)

    useEffect(() => {
        if (searchParams.has('page')) {
            setPage(Number(searchParams.get('page')))
        }
        if (searchParams.has('limit')) {
            setLimit(Number(searchParams.get('limit')))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search])

    const handleChangeLimit = (limit: number) => {
        setLimit(limit)
        searchParams.set('limit', limit.toString())
        navigate({
            search: searchParams.toString(),
        })
    }

    const handleChangePage = (page: number) => {
        setPage(page)
        searchParams.set('page', page.toString())
        navigate({
            search: searchParams.toString(),
        })
    }

    const handleNext = () => {
        handleChangePage(page + 1)
    }

    const handlePrev = () => {
        handleChangePage(page - 1)
    }

    return {page, limit, handlePrev, handleNext, handleChangePage, handleChangeLimit}
}

export default usePagination
