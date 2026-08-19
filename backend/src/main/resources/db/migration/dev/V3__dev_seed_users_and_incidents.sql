-- Insert Admin User (email: admin@saferoute.com, password: Admin123!)
INSERT INTO users (email, password, first_name, last_name, role_id, created_at, updated_at) 
VALUES ('admin@saferoute.com', '$2a$10$FCeL32dZvOEQMSOXCoEEUuH8NVx9VnHBmvJqflHIsFJQmgoo6jxNO', 'Admin', 'User', (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Moderator User (email: moderator@saferoute.com, password: Moderator123!)
INSERT INTO users (email, password, first_name, last_name, role_id, created_at, updated_at) 
VALUES ('moderator@saferoute.com', '$2a$10$qXDv54yTYuRHVsZC./fcBOAGfpi0VQgKHwliJF/vdFam5fh7vvNUm', 'Sarah', 'Moderator', (SELECT id FROM roles WHERE name = 'ROLE_MODERATOR'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Transport Authority User (email: authority@saferoute.com, password: Authority123!)
INSERT INTO users (email, password, first_name, last_name, role_id, created_at, updated_at) 
VALUES ('authority@saferoute.com', '$2a$10$MFtfxidORwfkZ0UCNKw48eks2Wem.gkiDL0uPg/S85ng7e3hm5rru', 'Transit', 'Authority', (SELECT id FROM roles WHERE name = 'ROLE_TRANSPORT_AUTHORITY'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Normal Users (email: user@saferoute.com, password: User123!)
INSERT INTO users (email, password, first_name, last_name, role_id, created_at, updated_at) 
VALUES ('user@saferoute.com', '$2a$10$l8RKW9HL11brRxGgqL7d4uzWq9Ks9WQD541PAg9/6x6xmiGol02C.', 'John', 'Doe', (SELECT id FROM roles WHERE name = 'ROLE_USER'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users (email, password, first_name, last_name, role_id, created_at, updated_at) 
VALUES ('user2@example.com', '$2a$10$l8RKW9HL11brRxGgqL7d4uzWq9Ks9WQD541PAg9/6x6xmiGol02C.', 'Jane', 'Smith', (SELECT id FROM roles WHERE name = 'ROLE_USER'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Sample Incidents (Sri Lanka Locations)
INSERT INTO incidents (title, description, category_id, severity, status, transport_type, latitude, longitude, route_name, vehicle_number, location_name, incident_date, is_anonymous, reporter_id) 
VALUES 
('Pickpocketing on 138 Bus', 'My wallet was stolen while the bus was crowded.', (SELECT id FROM incident_categories WHERE name = 'Theft'), 'Medium', 'Pending Review', 'Bus', 6.9271, 79.8612, '138 Maharagama-Colombo', 'ND-1234', 'Town Hall Bus Stop', '2026-08-17 10:00:00', false, (SELECT id FROM users WHERE email = 'user@saferoute.com')),
('Harassment at Railway Station', 'Someone was following me and making inappropriate comments.', (SELECT id FROM incident_categories WHERE name = 'Harassment'), 'High', 'Verified', 'Train', 6.9333, 79.8500, 'Coast Line', '', 'Fort Railway Station', '2026-08-16 14:30:00', true, (SELECT id FROM users WHERE email = 'user2@example.com')),
('Reckless Bus Driver', 'The driver was speeding and almost hit a pedestrian.', (SELECT id FROM incident_categories WHERE name = 'Unsafe driving'), 'High', 'Verified', 'Bus', 6.8649, 79.8997, '120 Horana-Colombo', 'WP-5678', 'Nugegoda Junction', '2026-08-18 11:00:00', false, (SELECT id FROM users WHERE email = 'user@saferoute.com'));
