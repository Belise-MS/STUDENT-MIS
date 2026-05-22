USE student_mis;

INSERT IGNORE INTO students (
  roll_number,
  first_name,
  last_name,
  email,
  phone,
  date_of_birth,
  gender,
  address,
  city,
  state,
  postal_code,
  enrollment_date,
  status
) VALUES
('STU004', 'Amina', 'Patel', 'amina.patel@student.com', '9876543213', '2005-09-12', 'F', '14 Campus Road', 'Hillcrest', 'WA', '98001', '2024-01-15', 'active'),
('STU005', 'Carlos', 'Rivera', 'carlos.rivera@student.com', '9876543214', '2004-11-22', 'M', '82 Library Street', 'Mapleton', 'IL', '60007', '2024-01-18', 'active'),
('STU006', 'Lerato', 'Mokoena', 'lerato.mokoena@student.com', '9876543215', '2005-02-08', 'F', '5 Science Avenue', 'Brookfield', 'MA', '01506', '2023-09-04', 'graduated');
