INSERT INTO movie(id, title, description, duration_minutes, image_url)
VALUES
    (1, 'Interstellar',
     'A team of explorers travel through a wormhole in space.',
     169,
     'interstellar.webp'),

    (2, 'Inception',
     'A thief enters people dreams to steal secrets.',
     148,
     'inception.webp'),

    (3, 'The Dark Knight',
     'Batman faces the Joker in Gotham City.',
     152,
     'dark_knight.webp');


INSERT INTO room(id, name)
VALUES
    (1, 'Room A'),
    (2, 'Room B');


INSERT INTO seat(id, row_number, seat_number, room_id)
VALUES
    -- Room A
    (1, 1, 1, 1),
    (2, 1, 2, 1),
    (3, 1, 3, 1),
    (4, 2, 1, 1),
    (5, 2, 2, 1),
    (6, 2, 3, 1),

    -- Room B
    (7, 1, 1, 2),
    (8, 1, 2, 2),
    (9, 1, 3, 2),
    (10, 2, 1, 2),
    (11, 2, 2, 2),
    (12, 2, 3, 2),
    (13, 2, 4, 2);


INSERT INTO show(id, date, movie_id, room_id)
VALUES
    (1, '2026-05-27 18:00:00', 1, 1),
    (2, '2026-05-27 21:00:00', 2, 1),
    (3, '2026-05-28 19:30:00', 3, 2),
    (4, '2026-05-28 22:00:00', 1, 2);

INSERT INTO users(username, password, enabled)
VALUES
    ('a', '{noop}p', 1);

INSERT INTO authorities(username, authority)
VALUES
    ('a', 'ROLE_TICKET_VALIDATOR');

-- Ensure sequences start after inserted IDs to avoid duplicate key errors
SELECT setval('movie_seq', COALESCE((SELECT MAX(id) FROM movie), 1), true);
SELECT setval('room_seq', COALESCE((SELECT MAX(id) FROM room), 1), true);
SELECT setval('seat_seq', COALESCE((SELECT MAX(id) FROM seat), 1), true);
SELECT setval('show_seq', COALESCE((SELECT MAX(id) FROM show), 1), true);
SELECT setval('ticket_seq', COALESCE((SELECT MAX(id) FROM ticket), 1), true);
SELECT setval('reservation_seq', COALESCE((SELECT MAX(id) FROM reservation), 1), true);