CREATE TABLE course(
  course_id BIGINT PRIMARY KEY NOT NULL,
  course_code VARCHAR(32) NOT NULL,
  course_name VARCHAR(256) NOT NULL,
  period VARCHAR(64),
  week VARCHAR(128),
  week_day VARCHAR(4),
  time_of_day VARCHAR(32),
  classroom VARCHAR(64),
  type VARCHAR(32),
  department VARCHAR(4),
  teacher VARCHAR(64),
  misc VARCHAR(512),
  group_name VARCHAR(16) DEFAULT '' NOT NULL
);
CREATE INDEX course_name_search ON course (course_name);
