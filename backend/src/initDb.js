import { query } from './db/index.js';

export const initDb = async () => {
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    const createRoomsTable = `
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      room_key VARCHAR(50) UNIQUE NOT NULL,
      leader_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    const createRoomMembersTable = `
    CREATE TABLE IF NOT EXISTS room_members (
      id SERIAL PRIMARY KEY,
      room_id INTEGER REFERENCES rooms(id),
      user_id INTEGER REFERENCES users(id),
      role VARCHAR(20) DEFAULT 'member',
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(room_id, user_id)
    );
  `;

    try {
        await query(createUsersTable);
        console.log('Users table initialized');

        await query(createRoomsTable);
        console.log('Rooms table initialized');

        await query(createRoomMembersTable);
        console.log('Room members table initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};
