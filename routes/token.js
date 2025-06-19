const express = require('express');
const router = express.Router();

// POST: Get Bearer Token (though this is get-token , palocity accepts POST to get token)
router.post('/get-token', async (req, res) => {
    try {
        const params = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: process.env.GRANT_TYPE,
            scope: process.env.SCOPE
        });

        const response = await fetch(process.env.PAYLOCITY_ENV_URL + "/IdentityServer/connect/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Unauthorized', details: data });
        }

        res.json({ token: data.access_token });
    } catch (error) {
        console.error('Error in get-token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


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
