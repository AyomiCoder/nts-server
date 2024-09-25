const Note = require('../models/Note');

const createNote = async (req, res) => {
    const { title, content, tags } = req.body;

    // Validate fields
    if (!title || !content) {
        return res.status(400).json({ error: true, message: "Title and content are required" });
    }

    try {
        // Create new note
        const note = new Note({
            userId: req.user.userId,  // Extracted from the JWT
            title,
            content,
            tags,
            createdOn: new Date(),
        });

        await note.save();

        return res.status(201).json({
            note,
            message: "Note created successfully"
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "An error occurred while creating the note" });
    }
};

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.userId }).sort({ createdOn: -1 });

        return res.json({
            notes
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "An error occurred while fetching notes" });
    }
};

const getSingleNote = async (req, res) => {
    const noteId = req.params.id; // Get the note ID from the request parameters

    try {
        const note = await Note.findOne({ _id: noteId, userId: req.user.userId }); // Find the note by ID and user ID

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" }); // Handle case where note does not exist
        }

        return res.json({
            note // Return the found note
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "An error occurred while fetching the note" });
    }
};


const searchNotes = async (req, res) => {
    const query = req.query.query;

    // Log the query and user ID for debugging
    console.log("Search query:", query);
    console.log("User ID:", req.user.userId);

    // Validate query parameter
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: true, message: "Query parameter is required" });
    }

    try {
        // Simple search by title, content, or tags
        const notes = await Note.find({
            userId: req.user.userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        });

        return res.json({
            notes
        });
    } catch (error) {
        console.error("Error fetching notes:", error); // Log the error
        return res.status(500).json({ error: true, message: "An error occurred while searching notes" });
    }
};



const updateNote = async (req, res) => {
    const { title, content, tags } = req.body;
    const noteId = req.params.id;

    try {
        // Find the note by ID and update
        const note = await Note.findOneAndUpdate(
            { _id: noteId, userId: req.user.userId }, 
            { title, content, tags },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        return res.json({
            note,
            message: "Note updated successfully"
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "An error occurred while updating the note" });
    }
};

const deleteNote = async (req, res) => {
    const noteId = req.params.id;

    try {
        const note = await Note.findOneAndDelete({ _id: noteId, userId: req.user.userId });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        return res.json({
            message: "Note deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "An error occurred while deleting the note" });
    }
};

const pinNote = async (req, res) => {
    const noteId = req.params.id;

    try {
        const note = await Note.findOne({ _id: noteId, userId: req.user.userId });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Toggle pin status
        note.isPinned = !note.isPinned;
        await note.save();

        return res.json({
            note,
            message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "An error occurred while pinning the note" });
    }
};

// Exporting all functions at once
module.exports = {
    createNote,
    getNotes,
    getSingleNote,
    searchNotes,
    updateNote,
    deleteNote,
    pinNote
};
