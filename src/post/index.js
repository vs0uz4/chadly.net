import React from "react";
import { graphql } from "gatsby";
import injectSheet from "react-jss";

import Layout from "../layout";
import Seo from "../seo";
import Author from "../author";
import { rhythm, scale } from "../theme/typography";

import CanonicalLink from "../canonical";
import massage from "./data";
import Feedback from "./feedback";
import EditPageLink from "./edit-page-link";

const BlogPostTemplate = ({ data, classes }) => {
	const {
		post,
		siteUrl,
		githubLink,
		fileAbsolutePath,
		comments,
		likes
	} = massage(data);

	return (
		<Layout>
			<Seo title={post.title} description={post.excerpt} />
			<CanonicalLink siteUrl={siteUrl} slug={post.slug} />

			<header className={classes.postHeader}>
				<h1>
					<EditPageLink
						githubLink={githubLink}
						fileAbsolutePath={fileAbsolutePath}
						className={classes.editLink}
					/>
					{post.title}
				</h1>
				<div className={classes.meta}>
					<time dateTime={post.date} itemProp="datePublished">
						{post.dateFormatted}
					</time>

					<span className={classes.readingTime}>{post.readingTime}</span>
				</div>
			</header>

			<main role="main" className={classes.postBody}>
				<article itemScope itemType="http://schema.org/BlogPosting">
					<section
						itemProp="articleBody"
						dangerouslySetInnerHTML={{
							__html: post.html
						}}
					/>
				</article>
			</main>

			<footer className={classes.postFooter}>
				<Author />
				<Feedback
					twitterId={post.twitterId}
					likes={likes}
					comments={comments}
				/>
			</footer>
		</Layout>
	);
};

const styles = {
	postHeader: {
		marginBottom: rhythm(1),
		"& h1": {
			marginBottom: rhythm(-0.1),
			"&:hover $editLink": {
				visibility: "visible"
			}
		},
		"& time": {
			...scale(-0.4)
		}
	},
	editLink: {
		float: "left",
		boxShadow: "none",
		paddingRight: rhythm(0.4),
		marginLeft: rhythm(-1.3),
		marginRight: 0,
		...scale(0.6),
		visibility: "hidden"
	},
	meta: {
		color: "var(--textMuted)"
	},
	postBody: {
		"& img": {
			display: "block",
			maxWidth: "100%",
			margin: "10px auto"
		},
		"& .twitter-tweet": {
			marginLeft: "auto",
			marginRight: "auto"
		},
		"& div.footnotes li p": {
			display: "inline"
		}
	},
	postFooter: {
		borderTop: "1px solid var(--hr)",
		paddingTop: rhythm(1),
		marginTop: rhythm(1)
	},
	readingTime: {
		float: "right",
		...scale(-0.4)
	}
};

export default injectSheet(styles)(BlogPostTemplate);

export const pageQuery = graphql`
	query BlogPostBySlug($slug: String!, $threadId: String!) {
		site {
			siteMetadata {
				siteUrl
				githubLink
			}
		}
		markdownRemark(fields: { slug: { eq: $slug } }) {
			frontmatter {
				id
				title
				date
				dateFormatted: date(formatString: "MMMM DD, YYYY")
				twitterId
			}
			fields {
				slug
			}
			html
			excerpt
			fields {
				readingTime {
					text
				}
			}
			fileAbsolutePath
		}
		disqusThread(threadId: { eq: $threadId }) {
			comments {
				id
				parentId
				author {
					name
					username
				}
				createdAt
				message
			}
		}
		allWebMentionEntry(filter: { fields: { slug: { eq: $slug } } }) {
			edges {
				node {
					id
					author {
						name
						photo
						url
					}
					url
					published
					wmTarget
					wmProperty
					content {
						text
					}
				}
			}
		}
	}
`;
