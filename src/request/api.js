const isOnline = location.host === 'ee.58corp.com'
const isSandbox = location.host === 'ee.58v5.cn'
const isTest = location.host === 'ee-dev.58v5.cn'

const BASE_URL = isOnline
    ? 'https://ee.58corp.com/api-yunxiao-ione/'
    : isSandbox
        ? 'https://iones.58v5.cn/'
        : isTest
            ? 'https://iones.58v5.cn/'
            //  : 'https://ee.58corp.com/api-yunxiao-ione/';
            : 'http://iones.58v5.cn/'; // local

const userUrls = {
    'currentUser': BASE_URL + 'integration/user/getUser',
    'userList': BASE_URL + 'integration/user/list/'
}

const urls = {
    ...userUrls
}

export default urls
export { BASE_URL }

