import { useMemo } from 'react';

import { type Label } from '../../matchers/types';

import { type InstanceMatchResult, matchInstancesToRouteTrees } from './useMatchPolicies';
import { useRoutingTreeLookup } from './useResolvedRoutingTree';

interface RoutingTreePreviewResult {
  /** Anything but `found` means the tree couldn't be confirmed, so `results` is empty and shouldn't be read as "no match". */
  status: 'resolving' | 'notFound' | 'error' | 'found';
  /** One result per instance, in order. When `status` is `found`, a result with no `matchedRoutes` means nothing matched. */
  results: InstanceMatchResult[];
}

const NO_RESULTS: InstanceMatchResult[] = [];

/** Previews how the instances route through a tree. An unset name previews the default tree. */
export function useRoutingTreePreview(
  routingTreeName: string | undefined,
  instances: Label[][]
): RoutingTreePreviewResult {
  const { found, isResolving, isError } = useRoutingTreeLookup(routingTreeName);
  const results = useMemo(
    () => (found ? matchInstancesToRouteTrees([found], instances) : NO_RESULTS),
    [found, instances]
  );

  if (isError) {
    return { status: 'error', results: NO_RESULTS };
  }
  if (isResolving) {
    return { status: 'resolving', results: NO_RESULTS };
  }
  if (!found) {
    return { status: 'notFound', results: NO_RESULTS };
  }

  return { status: 'found', results };
}
