CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE incident_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE incidents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category_id BIGINT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    transport_type VARCHAR(50) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    route_name VARCHAR(100),
    vehicle_number VARCHAR(50),
    location_name VARCHAR(200) NOT NULL,
    incident_date TIMESTAMP NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    reporter_id BIGINT,
    action_taken TEXT,
    action_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_incident_category FOREIGN KEY (category_id) REFERENCES incident_categories (id),
    CONSTRAINT fk_incident_reporter FOREIGN KEY (reporter_id) REFERENCES users (id)
);

CREATE TABLE incident_status_history (
    id BIGSERIAL PRIMARY KEY,
    incident_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    changed_by_id BIGINT,
    reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_incident FOREIGN KEY (incident_id) REFERENCES incidents (id),
    CONSTRAINT fk_history_user FOREIGN KEY (changed_by_id) REFERENCES users (id)
);

CREATE TABLE admin_notes (
    id BIGSERIAL PRIMARY KEY,
    incident_id BIGINT NOT NULL,
    admin_id BIGINT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_note_incident FOREIGN KEY (incident_id) REFERENCES incidents (id),
    CONSTRAINT fk_note_admin FOREIGN KEY (admin_id) REFERENCES users (id)
);

CREATE TABLE emergency_contacts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES users (id)
);
