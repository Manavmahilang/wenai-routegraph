//app/components/TravelGraph.tsx
"use client";

import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bus,
  ChevronRight,
  Expand,
  ShipWheel,
  LoaderCircle,
  Maximize2,
  Network,
  Plane,
  Train,
  X,
} from "lucide-react";

import type {
  GraphEdge,
  GraphNode,
} from "@/lib/types";

interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

function getTransportIcon(mode?: string) {
  switch (mode?.toUpperCase()) {
    case "FLIGHT":
      return Plane;

    case "TRAIN":
      return Train;

    case "BUS":
      return Bus;

    case "FERRY":
      return ShipWheel;

    default:
      return ArrowRight;
  }
}

function getTransportLabel(mode?: string) {
  if (!mode) return "Connection";

  return (
    mode.charAt(0) +
    mode.slice(1).toLowerCase()
  );
}

export function TravelGraph({
  cityId,
  cityName,
}: {
  cityId: string;
  cityName: string;
}) {
  const [graph, setGraph] =
    useState<GraphResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] =
    useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] =
    useState<GraphEdge | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGraph() {
      setLoading(true);
      setSelectedNode(null);
      setSelectedEdge(null);

      try {
        const response = await fetch(
          `/api/graph/${cityId}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load travel graph"
          );
        }

        const data: GraphResponse =
          await response.json();

        if (!cancelled) {
          setGraph(data);
        }
      } catch (error) {
        console.error(
          "Travel graph failed:",
          error
        );

        if (!cancelled) {
          setGraph({
            nodes: [],
            edges: [],
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGraph();

    return () => {
      cancelled = true;
    };
  }, [cityId]);

  const nodes: Node[] = useMemo(() => {
    if (!graph) return [];

    const center = graph.nodes.find(
      (node) => node.id === cityId
    );

    const destinations =
      graph.nodes.filter(
        (node) => node.id !== cityId
      );

    const centerNode: Node[] = center
      ? [
          {
            id: center.id,
            position: {
              x: 500,
              y: 320,
            },
            data: {
              label: center.label,
              image: center.image,
            },
            style: {
              width: 210,
              padding: 0,
              border: "0",
              background: "transparent",
            },
          },
        ]
      : [];

    const destinationNodes =
      destinations.map((node, index) => {
        const total = destinations.length;

        const angle =
          (index / Math.max(total, 1)) *
          Math.PI *
          2;

        const radius =
          total > 8 ? 390 : 315;

        return {
          id: node.id,

          position: {
            x:
              500 +
              Math.cos(angle) * radius,

            y:
              320 +
              Math.sin(angle) *
                radius *
                0.62,
          },

          data: {
            label: node.label,
            image: node.image,
          },

          style: {
            width: 175,
            padding: 0,
            border: "0",
            background: "transparent",
          },
        };
      });

    return [
      ...centerNode,
      ...destinationNodes,
    ];
  }, [graph, cityId]);

  const edges: Edge[] = useMemo(() => {
    if (!graph) return [];

    return graph.edges.map((edge) => {
      const isSelected =
        selectedEdge?.id === edge.id;

      const TransportIcon =
        getTransportIcon(edge.label);

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,

        type: "smoothstep",

        animated: isSelected,

        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: isSelected
            ? "#0f766e"
            : "#94a3b8",
        },

        style: {
          stroke: isSelected
            ? "#0f766e"
            : "#cbd5e1",
          strokeWidth: isSelected
            ? 3
            : 1.6,
        },

        label: getTransportLabel(
          edge.label
        ),

        labelStyle: {
          fill: isSelected
            ? "#0f766e"
            : "#64748b",
          fontSize: 10,
          fontWeight: 700,
        },

        labelBgStyle: {
          fill: "#ffffff",
          fillOpacity: 0.96,
        },

        labelBgPadding: [7, 4] as [
          number,
          number
        ],

        labelBgBorderRadius: 8,

        data: {
          icon: TransportIcon,
        },
      };
    });
  }, [graph, selectedEdge]);

  const handleNodeClick: NodeMouseHandler = (
    _event,
    node
  ) => {
    const found = graph?.nodes.find(
      (item) => item.id === node.id
    );

    if (found) {
      setSelectedNode(found);
      setSelectedEdge(null);
    }
  };

  const graphContent = (
    <div className="relative h-full w-full">
      {loading ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">
            <div className="flex items-center gap-3">
              <LoaderCircle
                size={18}
                className="animate-spin text-teal-700"
              />

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Building travel network
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Loading relationships from CognoDB
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : graph?.nodes.length === 0 ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
          <div className="max-w-xs text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Network size={25} />
            </div>

            <p className="mt-4 font-bold text-slate-900">
              No connections yet
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              This destination currently has no connected
              transport relationships in the graph.
            </p>
          </div>
        </div>
      ) : (
        <>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            fitViewOptions={{
              padding: 0.22,
              maxZoom: 1.15,
            }}
            minZoom={0.35}
            maxZoom={2}
            nodesDraggable
            nodesConnectable={false}
            elementsSelectable
            zoomOnDoubleClick={false}
            onNodeClick={handleNodeClick}
            onEdgeClick={(_event, edge) => {
              const found =
                graph?.edges.find(
                  (item) =>
                    item.id === edge.id
                );

              if (found) {
                setSelectedEdge(found);
                setSelectedNode(null);
              }
            }}
            proOptions={{
              hideAttribution: true,
            }}
          >
            <Background
              gap={28}
              size={1}
              color="#e2e8f0"
            />

            <Controls
              showInteractive={false}
              className="!overflow-hidden !rounded-xl !border !border-slate-200 !bg-white !shadow-lg"
            />

            <MiniMap
              pannable
              zoomable
              nodeColor={(node) =>
                node.id === cityId
                  ? "#0f766e"
                  : "#cbd5e1"
              }
              className="!overflow-hidden !rounded-xl !border !border-slate-200 !bg-white !shadow-lg"
            />
          </ReactFlow>

          {/* GRAPH LEGEND */}
          <div className="pointer-events-none absolute bottom-5 left-5 z-10 hidden rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-lg backdrop-blur sm:block">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Travel network
            </p>

            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                Selected
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                Destination
              </span>
            </div>
          </div>

          {/* INSPECTOR */}
          {selectedNode && (
            <div className="absolute right-4 top-4 z-20 w-[min(330px,calc(100%-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="relative h-32">
                {selectedNode.image ? (
                  <Image
                    src={selectedNode.image}
                    alt=""
                    fill
                    sizes="330px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-teal-700 to-cyan-700" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <button
                  type="button"
                  onClick={() =>
                    setSelectedNode(null)
                  }
                  aria-label="Close destination details"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
                >
                  <X size={15} />
                </button>

                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-lg font-bold text-white">
                    {selectedNode.label}
                  </p>

                  {selectedNode.countryName && (
                    <p className="text-xs text-white/70">
                      {selectedNode.countryName}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4">
                {selectedNode.description && (
                  <p className="line-clamp-3 text-xs leading-5 text-slate-500">
                    {selectedNode.description}
                  </p>
                )}

                <a
                  href={`/cities/${selectedNode.id}`}
                  className="mt-4 flex items-center justify-between rounded-xl bg-teal-700 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-teal-800"
                >
                  Explore destination
                  <ChevronRight size={15} />
                </a>
              </div>
            </div>
          )}

          {selectedEdge && (
            <div className="absolute right-4 top-4 z-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="flex items-center justify-between gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
                    Connection
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {getTransportLabel(
                      selectedEdge.label
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedEdge(null)
                  }
                  aria-label="Close connection details"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Select a destination node to inspect it.
              </p>
            </div>
          )}
        </>
      )}

      <div className="pointer-events-none absolute bottom-5 right-5 z-10 hidden rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2 text-[10px] font-semibold text-slate-400 shadow-sm backdrop-blur sm:block">
        Drag · Zoom · Select
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-white">
        <div className="absolute left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-700">
              Network explorer
            </p>

            <p className="font-bold text-slate-900">
              {cityName} travel graph
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setFullscreen(false)
            }
            aria-label="Close full screen graph"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Expand size={17} />
          </button>
        </div>

        <div className="h-full pt-16">
          {graphContent}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Network size={19} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
              Interactive graph
            </p>

            <h2 className="mt-0.5 text-base font-bold text-slate-900">
              {cityName} network
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setFullscreen(true)
          }
          aria-label="Open graph in full screen"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="h-[540px] sm:h-[620px]">
        {graphContent}
      </div>
    </div>
  );
}