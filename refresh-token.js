const axios = require('axios');

async function refreshToken() {
    const data = {
        client_id: "b7a6121b-50e2-4892-8935-ae6ae89e8e63",
        client_secret: "AeYNQyeuw7JxxtyZhDjA2v2GeWUhB1eWtgC9PUd1j1q0JsEnghs2Zrir27FngDyJ",
        grant_type: "refresh_token",
        refresh_token: "def50200266d46dd9ace0a24360d856bb9c4333dd1d03fd37d5499ca1ca20e16d487cf3a85ad52a2091aab249c65aa0f5528ccc017f4a5961d4c68851c70c7d3103b232e6c7c7cd9731fda097f38dd5d45833ca30994e615a7ab2b741779b1a48f521c6016242eb95fa9bbe9d2fbd53fcff0ea7e8875f4b9e6795cf7d98e071108352fd992dffa23e85d765131b74e2d978fcc7db946461345695fb6226508a4ab146d687731d253630ca441904e59014a0eb20fd235d59b5570da91567ab02ed84291ab611a7c9519cf6431afbe88f3133dbeb98d685b6e7e9c591ecfe0897ef3e6ae42b9b877c2b7bdbb42a43ce043727011c0d0078aff0e4a8ac9c4ff4141a0dd5db587809e017c54cb1debed885c2efa621e66f33bae4c57e3f8310c9176ff255b28ae245bb108c298c17b938eb22b182d3931ef77e0bede06d29a3cfd59e3ce315a96c5d5717dabdb0ba0f8a410dd325b87de1cc9b78dcd668b040e9eec1f35e75248ad064edbfde86135d349446cff2691fd6fd79b1e9025f0dae46566701a78ed4bda23b454a6b79fa37df3eed20262e905ae038ec7e5ed7ef8ba066678b530d82068268dfdfbaedf638360f373af74ac48726b71be022ff23ffe12a8d8cd6d0851eb441e781bcbf44800515ebf01b7291eaedc46e9947681b8a8686f36fb2f604d31954e4ec6a5e1d6",
        redirect_uri: "https://api.rspace.ru/amocrm/callback"
    };

    try {
        const response = await axios.post('https://rspace.amocrm.ru/oauth2/access_token', data);
        console.log('НОВЫЙ ACCESS TOKEN:');
        console.log(response.data.access_token);
        console.log('\nНОВЫЙ REFRESH TOKEN:');
        console.log(response.data.refresh_token);
    } catch (error) {
        console.error('Ошибка:', error.response?.data || error.message);
    }
}

refreshToken();
