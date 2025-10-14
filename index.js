const {initializeDatabase} = require('./db/db.connect')
const Lead = require('./models/leads.model')
const SalesAgent = require('./models/salesAgent.model')
const Comments = require('./models/comment.model')

const express = require('express')
const app = express()

initializeDatabase()

app.use(express.json())

const cors = require('cors')
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))




const createNewLead = async (newLead) => {
    try {
        const lead = new Lead(newLead)
        return await lead.save() 
    } catch (error) {
        throw error
    }
}

app.post('/leads', async (req, res) => {
    try {
        const leads = await createNewLead(req.body)
        leads ? 
        res.status(201).json({message: 'Lead added successfully.', lead: leads})
        :
        res.status(400).json({error: 'Error adding new lead or Check all input fields.'}) 

    } catch (error) {
        res.status(404).json({error: error.message})
    }
})



const getAllLeads = async () => {
    try {
        const leads = await Lead.find().populate('salesAgent')
        return leads

    } catch (error) {
        throw error
    }
}

app.get('/leads', async (req, res) => {
    try {
        const allLeads = await getAllLeads()
        allLeads.length > 0 ? res.json(allLeads) : res.status(400).json({error: "Leads not found or check all fields."})

    } catch (error) {
        res.status(404).json({error: error.message})
    }
})



const updateLeadById = async (leadId, dataToUpdate) => {
    try {
        const updateLead = await Lead.findByIdAndUpdate(leadId, dataToUpdate, {new: true})
        return updateLead

    } catch (error) {
        throw error
    }
}

app.post('/leads/update/:leadId', async (req, res) => {
    try {
        const updatedLead = await updateLeadById(req.params.leadId, req.body)
        updatedLead ? res.status(200).json({message: "Lead updated successfully", lead: updatedLead}) : res.status(400).json({error: "Lead not found or check all fields"})

    } catch (error) {
        res.status(404).json({error: error.message})
    }
})



const deleteLeadById = async (leadId) => {
    try {
        const leadToDelete = await Lead.findByIdAndDelete(leadId)
        return leadToDelete

    } catch (error) {
        throw error
    }
}

app.delete('/leads/delete/:leadId', async (req, res) => {
    try {
        const deletedLead = await deleteLeadById(req.params.leadId)
        deletedLead ? res.status(200).json({message: "Lead deleted successfully.", lead: deletedLead}) : res.status(400).json({error: "Lead not found"})

    } catch (error) {
        res.status(404).json({error: error.message})
    }
})





const createSalesAgent = async (newSalesAgent) => {
    try {
        const salesAgent = new SalesAgent(newSalesAgent)
        return await salesAgent.save()

    } catch (error) {
        throw error
    }
}

app.post('/salesAgent', async (req, res) => {
    try {
        const newAgent = await createSalesAgent(req.body)
        newAgent ? res.status(201).json({message: "Sales Agent added successfully", agent: newAgent}) 
        :
        res.status(400).json({error: "Error adding new sales agent or check all input fields."}) 

    } catch (error) {
        res.status(404).json({error: error.message})
    }
})



const getAllSalesAgent = async () => {
    try {
        const salesAgent = SalesAgent.find()
        return salesAgent

    } catch (error) {
        throw error
    }
}

app.get('/salesAgent', async (req, res) => {
    try {
        const allAgent = await getAllSalesAgent()
        allAgent.length > 0 ? res.json(allAgent) : res.status(400).json({error: "Agents not found or check all input fields"})
        
    } catch (error) {
        res.status(404).json({error: error.message})
    }
})





const createComments = async (newComment) => {
    try {
        const comment = new Comments(newComment)
        return await comment.save()

    } catch (error) {
        throw error
    }
}

app.post('/leads/comments', async (req, res) => {
    try {
        const newComment = createComments(req.body)
        newComment ? res.status(201).json({message: "Comment added successfully", comment: newComment}) : res.status(400).json({error: "Error adding new comment or check all input fields"})

    } catch (error) {
        res.status(404).json({error: error.message})
    }
})



const getAllComments = async () => {
    try {
        const getComments = await Comments.find().populate('author')
        return getComments

    } catch (error) {
        throw error
    }
}

app.get('/leads/comments', async (req, res) => {
    try {
        const allComments = await getAllComments()
        allComments.length > 0 ? res.json(allComments) : res.status(400).json({error: "Comments not found or check all input fields."})

    } catch (error) {
        res.status(404).json({error: error.message})
    }
})





const leadsClosedLastWeek = async () => {
    try {
        const leads = await Lead.find({status: "Closed"})
        return leads

    } catch (error) {
        throw error
    }
}

app.get('/report/last-week/closed', async (req, res) => {
    try {
        const closedLeads = await leadsClosedLastWeek()
        closedLeads ? res.status(200).json(closedLeads) : res.status(400).json({error: "No leads were found"})
        
    } catch (error) {
        res.status(404).json({error: error.message})
    }
})


const getTotalPipelineLeads = async () => {
    try {
        const openLeads1 = await Lead.find({status: "New"})
        const openLeads2 = await Lead.find({status: "Contacted"})
        const openLeads3 = await Lead.find({status: "Qualified"})
        const openLeads4 = await Lead.find({status: "Proposal Sent"})
        return {openLeads1, openLeads2, openLeads3, openLeads4}

    } catch (error) {
        throw error
    }  
}
app.get('/report/pipeline', async (req, res) => {
    try {
        const pipelineLeads = await getTotalPipelineLeads()
        pipelineLeads ? res.json(pipelineLeads) : res.status(400).json({error: "No leads were found"})

    } catch (error) {
        res.status(404).json({error: error.message})
    }
})



const PORT = process.env.MONGODB;
app.listen(PORT, () => {
    console.log("Server connected to port", PORT)
})
