const {PgLiteral} = require("node-pg-migrate");
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: {
            type: 'serial',
            notNull: true,
            primaryKey: true
        },
        public_id: {
            type: 'uuid',
            default: new PgLiteral('uuid_generate_v4()'),
            notNull: true,
        },
        username: { type: 'string', notNull: true },
        email: { type: 'string', notNull: true },
        password: { type: 'string', notNull: true },
        role: { type: 'string', notNull: true },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};

exports.down = pgm => {};
