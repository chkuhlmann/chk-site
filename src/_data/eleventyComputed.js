module.exports = {
  seo(data) {
    const { site, page } = data;
    const title = data.title || site.title;
    const fullTitle = data.isHomepage || title === site.title
      ? title
      : `${title} | ${site.name}`;
    const description = data.description || site.defaultDescription;
    const canonical = new URL(page.url, site.url).href;
    const image = new URL(data.image || site.defaultImage, site.url).href;
    const imageAlt = data.image ? data.imageAlt : site.defaultImageAlt;
    const personId = `${site.url}/#person`;
    const websiteId = `${site.url}/#website`;
    const pageId = `${canonical}#webpage`;
    const person = {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      url: `${site.url}/`,
      image: new URL(site.defaultImage, site.url).href,
      jobTitle: "Music producer and audio engineer",
      workLocation: { "@type": "City", name: "Nashville, Tennessee" }
    };
    const website = {
      "@type": "WebSite",
      "@id": websiteId,
      name: site.name,
      url: `${site.url}/`,
      inLanguage: "en",
      publisher: { "@id": personId }
    };
    const webpage = {
      "@type": data.schemaType || "WebPage",
      "@id": pageId,
      url: canonical,
      name: fullTitle,
      description,
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      about: { "@id": personId },
      primaryImageOfPage: { "@type": "ImageObject", url: image }
    };
    const graph = [person, website, webpage];
    if (data.isHomepage) {
      graph.push(...data.services.map(service => ({
        "@type": "Service",
        "@id": `${site.url}/#${service.id}`,
        name: service.name,
        description: service.description,
        serviceType: service.name,
        url: `${site.url}/#${service.id}`,
        provider: { "@id": personId },
        areaServed: { "@type": "City", name: "Nashville, Tennessee" },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${site.url}/contact/`
        }
      })));
    }
    if (data.socialType === "article") {
      graph.push({
        "@type": "BlogPosting",
        "@id": `${canonical}#article`,
        headline: title,
        description,
        image,
        datePublished: new Date(data.date || page.date).toISOString(),
        author: { "@id": personId },
        publisher: { "@id": personId },
        mainEntityOfPage: { "@id": pageId }
      });
    }
    return {
      title: fullTitle,
      description,
      canonical,
      image,
      imageAlt,
      structuredData: { "@context": "https://schema.org", "@graph": graph }
    };
  }
};
