import { APIRequestContext } from "@playwright/test";

export const NASA_API_BASE = 'https://images-api.nasa.gov';

export interface NasaAssetData {
  title?: string;
  nasa_id?: string;
  media_type?: string;
  description?: string;
  [key: string]: unknown;
}

export interface NasaSearchCollectionItem {
  href?: string;
  data?: NasaAssetData[];
  links?: { href?: string; rel?: string; render?: string }[];
}

export interface NasaSearchResponse {
  collection?: {
    items?: NasaSearchCollectionItem[];
    metadata?: { total_hits?: number };
  };
}

export interface NasaAssetResponse {
  collection?: {
    items?: { href?: string }[];
  };
}

export async function nasaSearch(request: APIRequestContext, q:string, options:{ media_type?:string, page?:number }):Promise<{status: number; body:NasaSearchResponse}>{
    const media_type = options.media_type ?? 'image';
    const page = options.page ?? 1;

    const response = await request.get(`${NASA_API_BASE}/search`,{
        params:{
            q,
            media_type,
            page
        }
    });
    const body = await response.json() as NasaSearchResponse;

    return { status: response.status(), body};
}

export async function nasaAsset(request: APIRequestContext, nasaId: string):Promise<{sts: number; bdy:NasaAssetResponse}>{
    const path = `/asset/${encodeURIComponent(nasaId)}`;

    const response = await request.get(`${NASA_API_BASE}${path}`);
    const bdy = await response.json() as NasaAssetResponse;
    
    return { sts: response.status(), bdy};
}

export function firstSearchItemData(body: NasaSearchResponse): NasaAssetData | undefined {
  const item = body.collection?.items?.[0];
  return item?.data?.[0];
}

export function extractDownloadableUrls(assetJson: NasaAssetResponse): string[] {
  const urls: string[] = [];
  const items = assetJson.collection?.items ?? [];
  for (const item of items) {
    if (item.href) collectHttpUrls(item.href, urls);
  }
  return urls;
}

function collectHttpUrls(value: unknown, out: string[]): void {
  if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectHttpUrls(v, out);
  }
}