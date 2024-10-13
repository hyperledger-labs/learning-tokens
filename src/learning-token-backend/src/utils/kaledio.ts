import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
const kaledio =
    process.env.KALEIDO_HD_WALLET_RPC_URL +
    'api/v1/wallets/:walletId/accounts/:accountIndex'
// ;('https://u0k1dk029t:hU5ERoJz_xLvmQzr8h1jmLr6a3Afn4Oa6T4NHjKJ2ro@u0jtyl6s8p-u0gt6e2xu2-hdwallet.us0-aws.kaleido.io/api/v1/wallets/:walletId/accounts/:accountIndex')
export const getWallet = async (type: string, id: number) => {
    try {
        let url = ''
        if (type === 'admin') {
            const _id = process.env.ADMIN_HD_WALLET_ID
            url = kaledio
                .replace(':walletId', _id)
                .replace(':accountIndex', id.toString())
        }
        if (type === 'institution') {
            const _id = process.env.INSTITUTION_HD_WALLET_ID
            url = kaledio
                .replace(':walletId', _id)
                .replace(':accountIndex', id.toString())
        }
        if (type === 'instructor') {
            const _id = process.env.INSTRUCTOR_HD_WALLET_ID
            url = kaledio
                .replace(':walletId', _id)
                .replace(':accountIndex', id.toString())
        }
        if (type === 'learner') {
            const _id = process.env.LEARNER_HD_WALLET_ID
            url = kaledio
                .replace(':walletId', _id)
                .replace(':accountIndex', id.toString())
        }

<<<<<<< HEAD
    const result = await axios.get(url)

    return result.data
=======
        const result = await axios.get(url)
        console.log('Kaleido HD Wallet result', result.data)

        return result.data
    } catch (err) {
        console.log(err, err)
        return
    }
>>>>>>> 087e550 (minor bug fixed)
}
