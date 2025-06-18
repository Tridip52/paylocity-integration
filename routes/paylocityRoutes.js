const express = require('express');
const router = express.Router();

// GET: Fetch employee
router.get('/get-employee', async (req, res) => {
    const { companyId, employeeId } = req.query;
    const authHeader = req.headers['authorization'];

    if (!companyId || !employeeId) {
        return res.status(400).json({ error: 'Missing required query parameters: companyId and employeeId' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header. Format: Bearer <token>' });
    }

    const token = authHeader.split(' ')[1];
    const url = process.env.PAYLOCITY_ENV_URL + `/api/v2/companies/${companyId}/employees/${employeeId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.text();
        let data;
        try {
            data = JSON.parse(result);
        } catch {
            data = { raw: result };
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        res.json(data);
    } catch (error) {
        console.error('Error in get-employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH: Update employee
router.patch('/update-employee', async (req, res) => {
    const { companyId, employeeId } = req.query;
    const authHeader = req.headers['authorization'];

    if (!companyId || !employeeId) {
        return res.status(400).json({ error: 'Missing required query parameters: companyId and employeeId' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header. Format: Bearer <token>' });
    }

    const token = authHeader.split(' ')[1];
    const url = process.env.PAYLOCITY_ENV_URL + `/api/v2/companies/${companyId}/employees/${employeeId}`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const result = await response.text();
        let data;
        try {
            data = JSON.parse(result);
        } catch {
            data = { raw: result };
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        res.json(data);
    } catch (error) {
        console.error('Error in update-pcr:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;

// let bh_fullTimeOrPartTime = "";
// let bh_W2Classification = "";
// let bh_PhysicalWorkStreetAddress = "";
// let bh_Physical_Work_City = "";
// let bh_Physical_Work_State = "";
// let bh_Physical_Work_Zip_Code = "";
// let bh_StartDate = "";
// let bh_EffectiveDate = "";
// let bh_PayRate = "";
// let bh_WorkAuthorization = "";   //candidate entity
// let bh_WorksiteOptions = "";
