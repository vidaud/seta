import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Select, Store } from '@ngxs/store';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { Node, OntologyGraph } from '../../models/ontology-graph.model';
import { MainSearch } from '../../store/seta.actions';
import { SetaState } from '../../store/seta.state';
declare var $: any;

@Component({
  selector: `app-similar-graph`,
  templateUrl: `./similar-graph.component.html`,
  styleUrls: [`./similar-graph.component.scss`]
})
export class SimilarGraphComponent implements OnInit {
  constructor(private store: Store) {
  }
  faSearch = faSearch;
  @Select(SetaState.term)
  term$: Observable<string>;

  @Select(SetaState.ontology)
  ontologyGraph$: Observable<OntologyGraph>;

  myColor =
    // d3
    // 	.scaleSequential()
    // 	.domain([0, 2])
    // 	.interpolator(d3.interpolateBlues)
    d3.scaleOrdinal(d3.schemeBlues[3]);
  // d3.quantize(d3.interpolateHcl('#002F67', '#F2F5F9'), 10)

  ngOnInit() {
    this.ontologyGraph$.subscribe((graph: OntologyGraph) => {
      if (graph && graph.nodes) {
        // const gCopy = Object.assign({}, graph)
        const gCopy = JSON.parse(JSON.stringify(graph));
        d3.select(`#myChart`).remove();
        const width = (document.querySelector(`#myChartContainer`) as HTMLElement).offsetWidth;
        const height = (document.querySelector(`#myChartContainer`) as HTMLElement).offsetHeight;



        const svg = d3
          .select(`#myChartContainer`)
          .append(`svg`)
          .attr(`id`, `myChart`)
          .attr(`width`, width)
          .attr(`height`, height)
          // Responsive SVG needs these 2 attributes and no width and height attr.
          .attr(`viewBox`, `0 0 ${width} ${height}`)
          .attr(`preserveAspectRatio`, `xMidYMid meet`)
          // Class to make it responsive.
          .classed(`svg-content-responsive`, true);

        svg.call(
          d3
            .zoom()
            .extent([
              [0, 0],
              [width, height]
            ])
            .scaleExtent([1, 8])
            .on(`zoom`, zoomed)
        );
        const simulation = d3
          .forceSimulation()
          .force(
            `link`,
            d3
              .forceLink()
              .id((link) => link.id)
              .distance(100)
              .strength(3)
          )
          .force(`charge`, d3.forceManyBody().strength(-200))
          .force(`center`, d3.forceCenter(width / 2, height / 2.5));

        const linkElements = svg
          .append(`g`)
          .attr(`stroke`, `#999`)
          .attr(`stroke-opacity`, 0.6)
          .selectAll(`line`)
          .data(gCopy.links)
          .join(`line`)
          .attr(`stroke-width`, (link) => link.value * 10);
        const nodeElements = svg
          .append(`g`)
          .attr(`stroke`, `#fff`)
          .attr(`stroke-width`, `1.5`)
          .selectAll(`circle`)
          .data(gCopy.nodes)
          .join(`circle`)
          .attr(`r`, this.getNodeSize)
          .attr(`fill`, this.getNodeColor)
          .attr(`style`, `cursor: pointer`)
          .attr(`data-toggle`, `tooltip`)
          .attr(`data-html`, `true`)
          .attr(
            `data-template`,
            `<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>`
          )
          .attr(`data-placement`, `left`)
          .attr(
            `title`,
            (d) => `<em>Name:</em> <u><b>${d.id}</b></u><br/><em>Found:</em> <u><b>${d.size}</b></u>`
          )
          // data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom"
          .call(this.drag(simulation))
          .on(`mouseover.fade`, fade(0.1))
          .on(`mouseout.fade`, fade(1))
          .on(`dblclick`, this.releasenode)
          .on(`click`, (d) => this.klick(d.id));

        $(`svg circle`).tooltip();

        const textElements = svg
          .append(`g`)
          .selectAll(`text`)
          .data(gCopy.nodes)
          .join(`text`)
          .text((node) => node.id)
          .attr(`font-size`, 10)
          .attr(`dx`, 15)
          .attr(`dy`, 4)
          .attr(`style`, `cursor: pointer`)

          // .on('mouseover.fade', fade(0.1))
          // .on('mouseout.fade', fade(1))
          .on(`click`, (d) => this.klick(d.id));

        simulation.nodes(gCopy.nodes).on(`tick`, () => {
          linkElements
            .attr(`x1`, (link) => link.source.x)
            .attr(`y1`, (link) => link.source.y)
            .attr(`x2`, (link) => link.target.x)
            .attr(`y2`, (link) => link.target.y);
          // nodeElements.attr('cx', node => node.x).attr('cy', node => node.y)
          // nodeElements.attr('transform', (d) => {
          // 	return 'translate(' + d.x + ',' + d.y + ')'
          // })
          nodeElements.attr(`cx`, (d) => d.x).attr(`cy`, (d) => d.y);
          textElements.attr(`x`, (node) => node.x).attr(`y`, (node) => node.y);
        });

        // simulation
        const linkedByIndex = {};
        gCopy.links.forEach((d) => {
          linkedByIndex[`${d.source},${d.target}`] = 1;
        });
        function isConnected(a, b) {
          // if (b.id === 'data protection') {
          // }
          return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.index === b.index;
        }
        function fade(opacity) {
          return (d) => {
            nodeElements.style(`stroke-opacity`, function(o) {
              // if (o.id === 'data protection') {
              // }
              const thisOpacity = isConnected(d, o) ? 1 : opacity;
              this.setAttribute(`fill-opacity`, thisOpacity);
              return thisOpacity;
            });

            linkElements.style(`stroke-opacity`, (o) => (o.source === d || o.target === d ? 1 : opacity));
            textElements.style(`opacity`, (o) => (isConnected(d, o) ? 1 : opacity));
          };
        }

        function zoomed() {
          nodeElements.attr(`transform`, d3.event.transform);
          linkElements.attr(`transform`, d3.event.transform);
          textElements.attr(`transform`, d3.event.transform);
        }

        simulation.force(`link`).links(gCopy.links);
      }
    });

    $(`#searcConceptIcon`).tooltip();
  }
  klick(a) {
    this.store.dispatch(new MainSearch(a));
    // this.searchForm.get('searchName').setValue(a)
    // this.searchVertex$.next()
  }

  drag = (simulation) => {
    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on(`start`, dragstarted)
      .on(`drag`, dragged)
      .on(`end`, dragended);
  }

  releasenode(d) {
    d.fx = null;
    d.fy = null;
  }

  getNodeColor(node: Node) {
    // const myColor = d3.scaleLinear().domain([1,5]).range(["brown", "yellow"])
    // const myColor = d3.scaleSequential(d3.interpolateYlOrBr)
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain([0, 1, 2, 3, 4]);
    const depth = parseInt(node.depth, 10);
    return color(depth);
    // return color(parseInt(node.depth, 10))
    // return myColor(depth === 0 ? depth : depth / 10)
  }

  getNodeSize(node: Node) {
    return Math.sqrt(node.graphSize) * 3.5;
    // return node.graphSize
  }
}
