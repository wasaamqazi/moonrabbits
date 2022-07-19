import React, { Component } from 'react'
import artworkleft from "../assets/imgs/artworkleft.png"
import artworkright from "../assets/imgs/artworkright.png"
export default class Newsection extends Component {
    render() {
        return (
            <div>
                <section className="artwork">
                    <div className="artwork-wrappersss">



                        <div className="artwork-wrapper">
                        </div>
                        <h2 className="artwork-title">
                            Art Work
                        </h2>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-6">
                                    <img className='artwork-left' src={artworkleft} alt="" />
                                </div>
                                <div className="col-sm-6">
                                    <p className='text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Nec, dolor aliquam at proin. Arcu sed interdum
                                        pellentesque urna purus duis neque. Id erat ut
                                    </p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <p className='text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Nec, dolor aliquam at proin. Arcu sed interdum
                                        pellentesque urna purus duis neque. Id erat ut
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <img className='artwork-left' src={artworkright} alt="" />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
