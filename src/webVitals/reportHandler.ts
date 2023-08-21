
import { Metric } from 'web-vitals';
import ReactGA from "react-ga4";

const TRACKING_ID = "UA-XXXXX-X"; // OUR_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);
// Multiple products (previously known as trackers)
//ReactGA.initialize([
//    {
//        trackingId: "your GA measurement id",
//        gaOptions: { ...}, // optional
//        gtagOptions: { ...}, // optional
//    },
//    {
//        trackingId: "your second GA measurement id",
//    },
//]);

function reportHandler(metric: Metric) {

    console.log("====================================");
    console.log(metric);

    const payload = JSON.stringify(metric);
    console.log(payload);
}

function reportHandler_endpoint(metric: Metric) {
    const payload = JSON.stringify(metric);
    navigator.sendBeacon('/analytics', payload);
}

// event values can only contain integers
function getEventValueFromMetric(metric: Metric) {
    if (metric.name === 'CLS') {
        return Math.round(metric.value * 1000);
    }
    return Math.round(metric.value);
}

function reportHandler_GoogleAnalytic(metric: Metric) {
    ReactGA.ga('send', 'event', {
        eventCategory: 'Web Vitals',
        eventAction: metric.name,
        eventValue: getEventValueFromMetric(metric),
        eventLabel: metric.id,
        nonInteraction: true,
    });
}

export default reportHandler;
