
# Imports
import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric, Text, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship

# Create Engine
engine = create_engine("sqlite:///soundcloud.sqlite")


# Declare a Base object here
Base = declarative_base()



# Define the ORM class for `allTimePlayCount`
class allTimePlayCount(Base):
    __tablename__ = 'allTimePlayCount'
    __table_args__ = {'extend_existing': True} 
    
    Genre = Column(Text, primary_key=True)
    allTimePlays = Column(Integer)
    
    def __repr__(self):
        return f"id={self.Genre}, name={self.allTimePlays}"


# Define the ORM class for `weeklyPlayCount`
class weeklyPlayCount(Base):
    
    __tablename__ = 'weeklyPlayCount'
    __table_args__ = {'extend_existing': True} 


    Genre = Column(Text, primary_key=True)
    weeklyPlays = Column(Integer)

    def __repr__(self):
        return f"id={self.Genre}, name={self.weeklyPlays}"


# Use `create_all` to create the tables
Base.metadata.create_all(engine)


# Verify that the table names exist in the database
engine.table_names()


# Use Pandas to Bulk insert each CSV file into their appropriate table

def populate_table(engine, table, csvfile):
    """Populates a table from a Pandas DataFrame."""
    # connect to the database
    conn = engine.connect()
    
    # Load the CSV file into a pandas dataframe 
    df_of_data_to_insert = pd.read_csv(csvfile)
    
    # Orient='records' creates a list of data to write
    data = df_of_data_to_insert.to_dict(orient='records')

    # Optional: Delete all rows in the table 
    conn.execute(table.delete())

    # Insert the dataframe into the database in one bulk insert
    conn.execute(table.insert(), data)
    
# Call the function to insert the data for each table
populate_table(engine, weeklyPlayCount.__table__, 'outputs/allWeeklyPlays.csv')
populate_table(engine, allTimePlayCount.__table__, 'outputs/allTimePlays.csv')

# # Use a basic query to validate that the data was inserted correctly for table `allTimePlayCount`
# engine.execute("SELECT * FROM allTimePlayCount").fetchall()

# # Use a basic query to validate that the data was inserted correctly for table `weeklyPlayCount`
# engine.execute("SELECT * FROM weeklyPlayCount").fetchall()

