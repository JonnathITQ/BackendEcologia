const mongoose = require('mongoose');

// Connection string from index.js
const uri = 'mongodb+srv://adrielprogramacion:adriel@proyectos.wgiooun.mongodb.net/ArteRecicla';

async function debugDB() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;

        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('\nAvailable Collections:');
        collections.forEach(c => console.log(` - ${c.name}`));

        // Check 'administrador' specifically
        const adminCollection = db.collection('administrador');
        const count = await adminCollection.countDocuments();
        console.log(`\nDocuments in 'administrador': ${count}`);

        if (count > 0) {
            const firstDoc = await adminCollection.findOne();
            console.log('First document sample:', firstDoc);
        } else {
            // Check 'administradors' just in case
            const adminsCollection = db.collection('administradors');
            const countAdmins = await adminsCollection.countDocuments();
            console.log(`Documents in 'administradors' (default name): ${countAdmins}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected');
    }
}

debugDB();
