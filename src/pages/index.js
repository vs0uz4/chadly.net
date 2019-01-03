import React from "react";
import { graphql } from "gatsby";

import Layout from "../layout";
import SEO from "../components/seo";

import Author from "../author";
import PostStub from "../post/stub";
import CanonicalLink from "../canonical";

import { get } from "lodash";

const RootIndex = ({ data }) => {
	const posts = get(data, "allContentfulBlogPost.edges");
	const [author] = get(data, "allContentfulPerson.edges");
	const siteUrl = get(data, "site.siteMetadata.siteUrl");

	return (
		<Layout>
			<SEO />
			<CanonicalLink siteUrl={siteUrl} />

			<Author author={author.node} />
			{posts.map(({ node }) => (
				<PostStub key={node.slug} {...node} />
			))}
		</Layout>
	);
};

export default RootIndex;

export const pageQuery = graphql`
	query HomeQuery {
		site {
			siteMetadata {
				siteUrl
			}
		}
		allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
			edges {
				node {
					title
					slug
					publishDate(formatString: "YYYY-MM-DD")
					body {
						childMarkdownRemark {
							fields {
								readingTime {
									text
								}
							}
						}
					}
				}
			}
		}
		allContentfulPerson {
			edges {
				node {
					name
					shortBio {
						childMarkdownRemark {
							html
						}
					}
					github
					twitter
					keybase
					image {
						fixed(width: 100) {
							width
							height
							src
							srcSet
						}
					}
				}
			}
		}
	}
`;
