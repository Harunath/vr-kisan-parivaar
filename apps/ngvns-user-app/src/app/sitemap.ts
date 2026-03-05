import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://vrkisanparivaar.com";

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/join`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/register?ref=VR5002GVQ8K`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/gallery`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/our-work/self-sustainable-villages`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/our-work/natural-farming`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/our-work/green-energy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/our-work/rural-employment`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/our-work/women-empowerment`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/our-work/agri-waste`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/our-work/livestock`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
	];
}
