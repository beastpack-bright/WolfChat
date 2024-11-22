const express = require('express');
const router = express.Router();
const auth = require('./controllers/auth');
const User = require('./models/User');
const Howl = require('./models/Howl');


// Middlware Route
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/404');
        return;
    }
    next();
};

// Public pages, no login
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/404', (req, res) => {
    res.render('404');
});

// Login required pages
router.get('/feed', requireAuth, (req, res) => {
    res.render('feed');
});

router.get('/howls', requireAuth, (req, res) => {
    res.render('howls');
});

router.get('/settings', requireAuth, (req, res) => {
    res.render('settings');
});

// api stuff for the howls
router.get('/api/howls', async (req, res) => {
    try {
        const howls = await Howl.find()
            .populate('author', 'username')
            .populate('replies.author', 'username')
            .sort({ createdAt: -1 });
        res.json(howls);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch howls' });
    }
});

router.post('/api/howls', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Must be logged in to howl' });
    }

    try {
        const newHowl = new Howl({
            content: req.body.content,
            author: req.session.user._id
        });
        await newHowl.save();
        res.json({ message: 'Howl posted successfully' });
    } catch (err) {
        console.log('Error creating howl:', err);
        res.status(500).json({ error: 'Failed to post howl' });
    }
});
router.post('/api/howls/:howlId/replies', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Must be logged in to reply' });
    }

    try {
        const howl = await Howl.findById(req.params.howlId);
        howl.replies.push({
            content: req.body.content,
            author: req.session.user._id
        });
        await howl.save();
        res.json({ message: 'Reply posted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to post reply' });
    }
});
router.delete('/api/howls/:howlId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Must be logged in to delete howls' });
    }

    try {
        const howl = await Howl.findById(req.params.howlId);
        if (howl.author.toString() !== req.session.user._id) {
            return res.status(403).json({ error: 'Not authorized to delete this howl' });
        }
        await howl.delete();
        res.json({ message: 'Howl deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete howl' });
    }
});
router.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});
router.delete('/api/howls/:howlId/replies/:replyId', async (req, res) => {
    try {
        const howl = await Howl.findById(req.params.howlId);
        const reply = howl.replies.id(req.params.replyId);
        
        if (reply.author.toString() === req.session.user._id) {
            howl.replies.pull({ _id: req.params.replyId });
            await howl.save();
            res.json({ message: 'Reply deleted successfully' });
        } else {
            res.status(403).json({ error: 'Not authorized to delete this reply' });
        }
    } catch (err) {
        console.log('Error deleting reply:', err);
        res.status(500).json({ error: 'Failed to delete reply' });
    }
});
//Settings stuff
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/api/settings/avatar', upload.single('avatar'), async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Must be logged in to update avatar' });
    }

    try {
        const user = await User.findById(req.session.user._id);
        user.avatar = `/uploads/${req.file.filename}`;
        await user.save();
        res.json({ message: 'Avatar updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update avatar' });
    }
});
// auth auth auth aith auth
router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// attempt at catch-all
router.get('', (req, res) => {
    res.status(404).render('404');
});

module.exports = router;