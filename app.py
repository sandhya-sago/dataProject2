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

engine=create_engine("sqlite:///static/soundcloud/soundcloud.sqlite")
session=Session(engine)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.1.html")

@app.route("/soundcloud")
def soundcloud():
    """Return the homepage."""
    return render_template("soundcloud.html")

@app.route("/billboard")
def billboard():
    return render_template("billboard.html")

@app.route("/tours")
def tours():
    return render_template("Marker_Clusters.html")

@app.route("/tours1")
def tours1():
    return render_template("concertours.html")

@app.route("/allTimePlaymetadata/")
def allTime():
    """Return a list of top performing genres."""
    # Use Pandas to perform the sql query
    stmt = "select * from allTimePlayCount"
    df = pd.read_sql_query(stmt, session.bind) 
    Trace1 = {"Genre": df["Genre"].tolist(), "allTimePlays": df["allTimePlays"].tolist()}
    return jsonify(Trace1)

@app.route("/weeklyPlaymetadata/")
def weeklyPlay():
    stmt2 = "select * from weeklyPlayCount"
    df2 = pd.read_sql_query(stmt2, session.bind)
    Trace2 = {"Genre": df2["Genre"].tolist(),"weeklyPlays": df2["weeklyPlays"].tolist()}
    return jsonify(Trace2)


if __name__ == "__main__":
    app.run(debug=True)