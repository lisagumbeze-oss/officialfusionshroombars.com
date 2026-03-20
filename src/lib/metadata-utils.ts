import { Metadata } from 'next';
import prisma from './prisma';

const BASE_URL = 'https://officialfusionshroombars.com';

export async function getPageMetadata(path: string, fallback: Metadata): Promise<Metadata> {
  // Build canonical URL from the path
  const canonicalUrl = path === '/' ? BASE_URL : `${BASE_URL}${path}`;

  try {
    const meta = await (prisma as any).pageMetadata.findUnique({
      where: { path }
    });

    if (!meta) {
      return {
        ...fallback,
        alternates: {
          canonical: canonicalUrl,
        },
      };
    }

    return {
      ...fallback,
      title: meta.title || fallback.title,
      description: meta.description || fallback.description,
      keywords: meta.seoKeywords || fallback.keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        ...fallback.openGraph,
        title: meta.title || (fallback.openGraph as any)?.title,
        description: meta.description || (fallback.openGraph as any)?.description,
      },
    };
  } catch (e) {
    return {
      ...fallback,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

