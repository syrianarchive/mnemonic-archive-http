/* global locale */
import React, { Component } from "react";
// import {map} from 'lodash/fp';
import { databaseApiUrl } from "../../../../env";

import t from "../../../translations";

export default class Investigations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meta: {
        weapons: []
      }
    };
  }

  componentDidMount() {
    this.getMeta();
  }

  getMeta() {
    return fetch( // eslint-disable-line
      `${databaseApiUrl}/meta`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(r => r.json())
      .then(r => this.setState({ meta: r }));
  }

  render() {
    //    const vv = this.state.meta.verified ? this.state.meta.verified.toLocaleString() : '';
    //    const c = this.state.meta.total ? this.state.meta.total.toLocaleString() : '';

    return (
      <div className="container frontstats">
        <div className="columns">
          <div className="col-2 col-sm-12">
            <div className="statcol">
              <h3>
                <b>401,525</b>
              </h3>{" "}
              <br />
              <h6>{t("Collected Video Content")}</h6>
            </div>
          </div>

          <div className=" col-3 col-sm-12 arrow">
            {locale === "en" ? (
              <span className="arrowb">➞</span>
            ) : (
              <span className="arrowb">⬅</span>
            )}
          </div>

          <div className="col-2 col-sm-12">
            <div className="statcol">
              <h3>
                <b>112,108</b>
              </h3>{" "}
              <br />
              <h6>{t("Collected Tweets Content")}</h6>
            </div>
          </div>

          <div className=" col-3 col-sm-12 arrow">
            {locale === "en" ? (
              <span className="arrowb">➞</span>
            ) : (
              <span className="arrowb">⬅</span>
            )}
          </div>

          <div className="col-2 col-sm-12">
            <div className="statcol">
              <h2>
                <b>513,633</b>
              </h2>
              <br />
              <h6>{t("Collected Digital Units")}</h6>
            </div>
          </div>

          {/* <div className=" col-1 col-sm-12 arrow"> */}
          {/*   {locale === 'en' ? */}
          {/*     <span className="arrowb">➞</span> */}
          {/*     : */}
          {/*     <span className="arrowb">⬅</span> */}
          {/*    } */}
          {/* </div> */}

          {/* <div className="col-4 vvv"> */}
          {/*   <h5> */}
          {/*     <b> */}
          {/*       {t('Incidents')} */}
          {/*     </b> */}
          {/*   </h5> */}
          {/*   {map(v => */}
          {/*     <div className="frontvio"> */}
          {/*       <h6><a href={'#'}> */}
          {/*         {t(v)} */}
          {/*       </a></h6> */}
          {/*     </div> */}
          {/*     , this.state.meta.violationtypes)} */}
          {/* </div> */}
        </div>
      </div>
    );
  }
}
