const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Middleware


app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb+srv://saniulsaz:12345@roktodin.abnxvco.mongodb.net/PhysicsBatchZHS', {

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/hsc25', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hsc25.html'));
});

app.get('/hsc26', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hsc26.html'));
});

const noticeSchema = new mongoose.Schema({
  tag: String,
  noticeText: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const Notice = mongoose.model('Notice', noticeSchema);

app.post('/addNotice', async (req, res) => {
    const { tag, noticeText, date } = req.body;

    // Handle undefined date
    const finalDate = date ? new Date(date) : undefined;

    try {
        const notice = new Notice({ tag, noticeText, date: finalDate });
        await notice.save();
        console.log('Notice saved:', notice);
        res.send('Notice added successfully!');
    } catch (error) {
        console.error('Error saving notice:', error);
        res.status(500).send('Error adding notice: ' + error.message);
    }
});

app.get('/notices', async (req, res) => {
    try {
      const notices = await Notice.find(); 
      console.log('Notices fetched:', notices);
      res.json(notices); 
    } catch (error) {
      console.error('Error fetching notices:', error);
      res.status(500).send('Error fetching notices: ' + error.message);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).send('Something went wrong: ' + err.message);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
