import axios from 'axios'

const kaledio =
    'https://u0k1dk029t:hU5ERoJz_xLvmQzr8h1jmLr6a3Afn4Oa6T4NHjKJ2ro@u0jtyl6s8p-u0gt6e2xu2-hdwallet.us0-aws.kaleido.io/api/v1/wallets/:type/accounts/:id'
export const getWallet = async (type: string, id: number) => {
    let url = ''
    if (type === 'admin') {
        const _id = 'kuitpud2'
        url = kaledio.replace(':type', _id).replace(':id', id.toString())
    }
    if (type === 'institution') {
        const _id = '4jde4ddy'
        url = kaledio.replace(':type', _id).replace(':id', id.toString())
    }
    if (type === 'instructor') {
        const _id = 'oz438t3o'
        url = kaledio.replace(':type', _id).replace(':id', id.toString())
    }
    if (type === 'learner') {
        const _id = 'ovjhrfvp'
        url = kaledio.replace(':type', _id).replace(':id', id.toString())
    }

    const result = await axios.get(url)

    return result.data
}
