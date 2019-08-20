import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchBlog } from 'actions';

class BlogShow extends Component {
    componentDidMount() {
        const { dispatch, match } = this.props;
        dispatch(fetchBlog(match.params._id));
    }

    renderImage() {
        const { blog } = this.props;

        if (blog.imageUrl) {
            return (
                <img
                    src={`https://my-blog-bucket-demo-123.s3-ap-southeast-2.amazonaws.com/${
                        blog.imageUrl
                    }`}
                    alt="Blog"
                />
            );
        }
    }

    render() {
        const { blog } = this.props;

        if (!blog) return '';

        const { title, content } = blog;
        return (
            <>
                <h3>{title}</h3>
                <p>{content}</p>
                {this.renderImage()}
            </>
        );
    }
}

const mapStateToProps = ({ blogs }, ownProps) => ({
    blog: blogs[ownProps.match.params._id]
});

export default connect(mapStateToProps)(BlogShow);
