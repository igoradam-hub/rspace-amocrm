const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// КОНФИГУРАЦИЯ
const CONFIG = {
    // ЗАМЕНИТЕ НА ВАШ ТОКЕН!
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk0ZWM0YTEwNDY5ZThkYTQ0ZDdhNWJhMWQzOWIyZjY5ODliMTFjYzUxOTBkNGFlODMxYTc2MDk2NWQ2MWQ3ZDIyNThjOTZkYzhkMjE0ZmFmIn0.eyJhdWQiOiIwMjU3Y2VmNC1jMWYzLTQ2YzItOTM4ZC01YWUxZjA3Y2Q4NzIiLCJqdGkiOiI5NGVjNGExMDQ2OWU4ZGE0NGQ3YTViYTFkMzliMmY2OTg5YjExY2M1MTkwZDRhZTgzMWE3NjA5NjVkNjFkN2QyMjU4Yzk2ZGM4ZDIxNGZhZiIsImlhdCI6MTc2ODQwMzU5NywibmJmIjoxNzY4NDAzNTk3LCJleHAiOjE3Njg0ODk5OTcsInN1YiI6IjcwOTc3NDMiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzI2MDMxMTgsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6Miwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdLCJoYXNoX3V1aWQiOiJiY2JiOGU4OS02MmM2LTQ4ZDAtOTNkNS1mMTE1ZDMxZjc4NDEiLCJ1c2VyX2ZsYWdzIjowLCJhcGlfZG9tYWluIjoiYXBpLWIuYW1vY3JtLnJ1In0.BbWdcSNZev5NWrNgJ5Op-Dd0-mGN1gv7w0S3r7iwSAXVcwQLPwA4n_ZvjLtpTmm1dbGvmpsGHH5yr_r5-_q3n6jAX66li6Tlk3m3cgW1iLKa5n-cHKHbCFydaTir50rMFg37itf4yqQLW5OMVXi660WNe4ApbClJXR5r1-pj_FBluuV2VNDupeaKcjh_QVI2ilS-81CV2CMj_pE-z0vypgfEUW5nYbkHyFqpwK3vv2wFS0clqcw3z_uTsfFaaZjgKZ-4WzbAinhDS9KSaAk9qLQ9afvcjtTqxwWUEHMc3mfSpt7-JFhvPcauTkMy_sKA0lOD-1pjQI1V2BJhSLIeJA',
    baseUrl: 'https://rspace.amocrm.ru/api/v4',
    pipelineId: 10479390,
    stageNewId: 82736142,
    userIdFieldId: 2091693
};

// Главная страница
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'RSpace AmoCRM Webhook работает!' 
    });
});

// Тест подключения
app.get('/test', async (req, res) => {
    try {
        const response = await axios.get(`${CONFIG.baseUrl}/account`, {
            headers: { 'Authorization': `Bearer ${CONFIG.token}` }
        });
        res.json({ 
            status: 'success',
            account_name: response.data.name
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook для создания лида
app.post('/webhook', async (req, res) => {
    const { name, email, phone, user_id } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email required' });
    }
    
    try {
        // Создаем контакт
        const contactData = [{
            name: name,
            custom_fields_values: [
                { field_code: 'EMAIL', values: [{ value: email }] },
                { field_code: 'PHONE', values: [{ value: phone || '' }] }
            ]
        }];
        
        const contactResponse = await axios.post(
            `${CONFIG.baseUrl}/contacts`,
            contactData,
            { headers: { 'Authorization': `Bearer ${CONFIG.token}` } }
        );
        
        const contactId = contactResponse.data._embedded.contacts[0].id;
        
        // Создаем сделку
        const leadData = [{
            name: `Регистрация: ${name}`,
            pipeline_id: CONFIG.pipelineId,
            status_id: CONFIG.stageNewId,
            _embedded: {
                contacts: [{ id: contactId }]
            }
        }];
        
        const leadResponse = await axios.post(
            `${CONFIG.baseUrl}/leads`,
            leadData,
            { headers: { 'Authorization': `Bearer ${CONFIG.token}` } }
        );
        
        const leadId = leadResponse.data._embedded.leads[0].id;
        
        res.json({
            success: true,
            contact_id: contactId,
            lead_id: leadId
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
