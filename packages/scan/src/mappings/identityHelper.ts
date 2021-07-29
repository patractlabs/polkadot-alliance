import type { Data, Option, Struct, Vec } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { H160 } from '@polkadot/types/interfaces/runtime';

export interface IdentityInfo extends Struct {
  readonly additional: Vec<IdentityInfoAdditional>;
  readonly display: Data;
  readonly legal: Data;
  readonly web: Data;
  readonly riot: Data;
  readonly email: Data;
  readonly pgpFingerprint: Option<H160>;
  readonly image: Data;
  readonly twitter: Data;
}

export interface IdentityInfoAdditional extends ITuple<[Data, Data]> {}

export interface IdentityInfoJson {
  additional: string | null;
  display: string | null;
  displayParent: string | null;
  legal: string | null;
  web: string | null;
  riot: string | null;
  email: string | null;
  pgpFingerprint: string | null;
  image: string | null;
  twitter: string | null;
  isGood: boolean | null;
}

export async function getIdentity(address: string): Promise<IdentityInfoJson> {
  const identity = await api.query.identity.identityOf(address);
  const identityInfo = identity.unwrapOrDefault().info;
  const isGood = identity
    .unwrapOrDefault()
    .judgements.some(
      ([, judgement]) => judgement.isKnownGood || judgement.isReasonable
    );

  const info: IdentityInfoJson = {
    additional: identityInfo.additional.isEmpty
      ? null
      : (identityInfo.additional.toHuman() as string),
    display: identityInfo.display.isEmpty
      ? null
      : (identityInfo.display.asRaw.toHuman() as string),
    displayParent: null,
    legal: identityInfo.legal.isEmpty
      ? null
      : (identityInfo.legal.asRaw.toHuman() as string),
    web: identityInfo.web.isEmpty
      ? null
      : (identityInfo.web.asRaw.toHuman() as string),
    riot: identityInfo.riot.isEmpty
      ? null
      : (identityInfo.riot.asRaw.toHuman() as string),
    email: identityInfo.email.isEmpty
      ? null
      : (identityInfo.email.asRaw.toHuman() as string),
    pgpFingerprint: identityInfo.pgpFingerprint.isEmpty
      ? null
      : identityInfo.pgpFingerprint.unwrap().toString(),
    image: identityInfo.image.isEmpty
      ? null
      : (identityInfo.image.asRaw.toHuman() as string),
    twitter: identityInfo.twitter.isEmpty
      ? null
      : (identityInfo.twitter.asRaw.toHuman() as string),
    isGood
  };

  const addressParent = await api.query.identity.superOf(address);

  if (addressParent.isEmpty) return info;

  const identityParent = await api.query.identity.identityOf(
    addressParent.unwrap()[0]
  );

  info.displayParent = identityParent.unwrapOrDefault().info.isEmpty
    ? null
    : (identityParent.unwrapOrDefault().info.display.toHuman() as string);

  return info;
}
