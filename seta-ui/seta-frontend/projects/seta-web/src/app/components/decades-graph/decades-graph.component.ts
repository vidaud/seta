import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { DecadeGraph } from '../../models/decade-graph.model';
import { SetaState } from '../../store/seta.state';
declare var $: any;

@Component({
  selector: `app-decades-graph`,
  templateUrl: `./decades-graph.component.html`,
  styleUrls: [`./decades-graph.component.scss`]
})
export class DecadesGraphComponent implements OnInit {
  @Select(SetaState.decade)
  decadeGraph$: Observable<DecadeGraph>;
  constructor() {}

  ngOnInit() {
    this.decadeGraph$.subscribe((graph: DecadeGraph) => {
      if (graph) {
        const gCopy = JSON.parse(JSON.stringify(graph));
        d3.select(`#decadesChart`).remove();
        const margin = { top: 20, right: 20, bottom: 70, left: 40 };
        const width =
          (document.querySelector(`#decadesChartContainer`) as HTMLElement).offsetWidth -
          margin.left -
          margin.right;
        const height = 282;
        const svg = d3
          .select(`#decadesChartContainer`)
          .append(`svg`)
          .attr(`id`, `decadesChart`);
        svg.attr(`width`, width + margin.left + margin.right).attr(
          `height`,
          height + margin.top + margin.bottom
        );


        const x = d3
          .scaleBand()
          .rangeRound([0, width])
          .padding(0.1);

        const y = d3.scaleLinear().rangeRound([height, 0]);

        const g = svg.append(`g`).attr(`transform`, `translate(` + margin.left + `,` + margin.top + `)`);

        x.domain(
          gCopy.years.map((d) => {
            return d.key;
          })
        );

        y.domain([
          0,
          d3.max(gCopy.years, (d) => {
            return d.value;
          })
        ]);

        const myColor = d3
          .scaleSequential()
          .domain([1, 10])
          .interpolator(d3.interpolateSpectral);
        // .domain([1, 10])
        // .interpolator(d3.interpolateViridis)
        // .domain()
        // .interpolator(d3.interpolatePuRd)

        g.append(`g`)
          .attr(`class`, `axis axis--x`)
          .attr(`transform`, `translate(0,` + height + `)`)
          .call(d3.axisBottom(x))
          .append(`text`)
          .attr(`fill`, `#000`)
          // .attr('transform', 'rotate(90)')
          .attr(`x`, width)
          .attr(`dy`, `2em`)
          .attr(`text-anchor`, `end`);
        // .text('Decades')

        // .ticks(10, '%')
        g.append(`g`)
          .attr(`class`, `axis axis--y`)
          .call(d3.axisLeft(y))
          .append(`text`)
          .attr(`fill`, `#000`)
          .attr(`transform`, `rotate(-90)`)
          .attr(`y`, 6)
          .attr(`dy`, `0.71em`)
          .attr(`text-anchor`, `end`)
          .text(`Documents`);

        g.selectAll(`.bar`)
          .data(gCopy.years)
          .enter()
          .append(`rect`)
          .attr(`fill`, (d) => myColor(d.id))
          .attr(`class`, `bar`)
          .attr(`x`, (d) => {
            return x(d.key);
          })
          .attr(`y`, (d) => {
            return y(d.value);
          })
          .attr(`width`, x.bandwidth())
          .attr(`height`, (d) => {
            return height - y(d.value);
          })
          .attr(`style`, `cursor: pointer`)
          .attr(`data-toggle`, `tooltip`)
          .attr(`data-html`, `true`)
          .attr(
            `data-template`,
            `<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>`
          )
          .attr(`data-placement`, `top`)
          .attr(`title`, (d) => `<em>Documents:</em> <u><b>${d.value}</b></u>`);

        $(`svg .bar`).tooltip();

        g.selectAll(`.text`)
          .data(gCopy.years)
          .enter()
          .append(`text`)
          .attr(`class`, `label`)
          .attr(`x`, (d) => {
            return x(d.key);
          })
          .attr(`y`, (d) => {
            return y(d.value) - 20;
          })
          .attr(`dy`, `.75em`)
          .text((d) => {
            return d.value;
          });

        // g.selectAll('text')
        // 	.data(gCopy.years)
        // 	.enter()
        // 	.append('text')
        // 	.text((d) => {
        // 		return d.value
        // 	})
        // 	.attr('text-anchor', 'middle')
        // 	.attr('fill', 'white')
        // 	.attr('x', (d, i) => {
        // 		return i * (width / gCopy.years.length)
        // 	})
        // 	.attr('y', (d) => {
        // 		return height - d * 4
        // 	})
      }
    });
  }
}
