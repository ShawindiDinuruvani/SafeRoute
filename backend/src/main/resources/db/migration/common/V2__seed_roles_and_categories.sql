-- Insert System Roles
INSERT INTO roles (name) VALUES 
('ROLE_USER'), 
('ROLE_ADMIN'), 
('ROLE_MODERATOR'), 
('ROLE_TRANSPORT_AUTHORITY');

-- Insert System Incident Categories
INSERT INTO incident_categories (name) VALUES 
('Harassment'), 
('Accident'), 
('Vehicle breakdown'), 
('Unsafe driving'), 
('Theft'), 
('Poor lighting'), 
('Unsafe location'), 
('Route delay'), 
('Overcrowding'), 
('Other');
