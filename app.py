import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

engine=create_engine("sqlite:///soundcloud.sqlite")
session=Session(engine)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/metadata/")
def names():
    """Return a list of top performing genres."""

    # Use Pandas to perform the sql query
    stmt = "select * from allTimePlayCount"
    # stmt2 = db.session.query(weeklyPlayCount).statement
    df = pd.read_sql_query(stmt, session.bind)
    data = {"Genre": df["Genre"].tolist(),"allTimePlays": df["allTimePlays"].tolist()}
    # Return a list of the column names (sample names)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)

