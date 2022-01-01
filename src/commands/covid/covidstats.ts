import { ChartConfiguration, ChartTypeRegistry } from "chart.js";
import { ChartJSNodeCanvas as Chart } from "chartjs-node-canvas";
import Command from "../../classes/Command";
import CovidStats from "../../typings/covid/covidstats";
import { embed, errorMessage } from "../../util/embed";
import { getJSON } from "../../util/web";

export default new Command({
  name: "covidstats",
  description: "Get a pretty chart of Coronavirus data",
  category: "covid",
  perms: [],
  options: [
    {
      name: "country",
      description: "Country to see stats for",
      type: "STRING",
      autocomplete: true,
      required: true,
    },
  ],
  usage: "<country>",
  example: "Australia",

  async execute({ bot, ctx, args }) {
    await ctx.deferReply();
    const country = args.getString("country");
    const canvas = new Chart({
      width: 1920,
      height: 1080,
      backgroundColour: "#FFFFFF",
    });
    const { data } = await getJSON<CovidStats>(
      `https://disease.sh/v3/covid-19/countries/${country}`
    );
    const { timeline: barData } =( await getJSON<any>(
      `https://disease.sh/v3/covid-19/historical/${country}?lastdays=14`
    )).data;
   
    if (!data || !barData) {
      return ctx.editReply(
        errorMessage("Sorry, but data is not avaliable for that country!")
      );
    }
    const config = {
      type: "pie" as keyof ChartTypeRegistry,
      data: {
        labels: ["Cases Today", "Deaths Today", "Recovered Today"],
        datasets: [
          {
            data: [data.todayCases, data.todayDeaths, data.todayRecovered],
            backgroundColor: ["#FFA500", "#FF0000", "#00FF00"],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Coronavirus C/D/R Today",
            font: {
              size: 72,
            },
          },
          legend: {
            labels: {
              font: {
                size: 48,
              },
            },
          },
        },
      },
    };
    const barConfig: ChartConfiguration = {
      type: "bar",
      data: {
        labels: Object.keys(barData.cases),
        datasets: [
          {
            label: "COVID Cases",
            data: Object.values(barData.cases),
            backgroundColor: "#FFA500",
          },
          {
            label: "COVID Deaths",
            data: Object.values(barData.deaths),
            backgroundColor: "#FF0000",
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Coronavirus C/D (Last 14 days) (TOTAL CASES SINCE PANDEMIC)",
            font: {
              size: 72,
            },
          },
          legend: {
            labels: {
              font: {
                size: 48,
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              font: {
                size: 48,
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: 48,
              },
            },
          },
        },
      },
    };

    const em = embed(
      {
        title: "Coronavirus Statistics",
        description: `Coronavirus statistics for today. Data was fetched <t:${Math.round(
          Date.now() / 1000
        )}:R>. For country ${country}`,
      },
      ctx,
      bot
    );
    ctx.editReply({
      embeds: [em],
      files: [
        await canvas.renderToBuffer(config),
        await canvas.renderToBuffer(barConfig),
      ],
    });
  },
});
