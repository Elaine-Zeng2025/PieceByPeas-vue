import sqlite3
conn = sqlite3.connect('meals.db')
conn.execute('ALTER TABLE meals ADD COLUMN tags TEXT DEFAULT "[]"')
conn.commit()
conn.close()
print('done')