import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { cookedOrders } from "../../__generated__/cookedOrders";
import { Link, useHistory } from "react-router-dom";
import { takeOrder, takeOrderVariables } from "../../__generated__/takeOrder";

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const onSucces = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      // const geocoder = new google.maps.Geocoder();
      // geocoder.geocode(
      //   {
      //     location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //   },
      //   (results, status) => {
      //     console.log(results, status);
      //   }
      // );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map }: { map: google.maps.Map }) => {
    setMap(map);
  };

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  const { data: cookedOrderData } = useSubscription<cookedOrders>(
    COOKED_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (cookedOrderData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrderData]);

  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    const { ok } = data.takeOrder;
    if (ok) {
      history.push(`/order/${cookedOrderData?.cookedOrders.id}`);
    }
  };
  const [takeOrderMutation, { loading: takeOrderLoading }] = useMutation<
    takeOrder,
    takeOrderVariables
  >(TAKE_ORDER_MUTATION, { onCompleted });

  const triggerMutation = (orderId: number) => {
    takeOrderMutation({ variables: { input: { id: orderId } } });
  };

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          defaultCenter={{
            lat: 36.58,
            lng: 125.95,
          }}
          bootstrapURLKeys={{ key: "AIzaSyD5f8an_wAHk4PqO5UIjp05fXEiSyp7d1o" }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrderData?.cookedOrders ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Cooked Order
            </h1>
            <h2 className="text-center my-3 text-2xl font-medium">
              Pick it up soon @ {cookedOrderData.cookedOrders.restaurant?.name}
            </h2>
            <button
              onClick={() => triggerMutation(cookedOrderData.cookedOrders.id)}
              className="btn w-full mt-5"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No Orders yes...</h1>
        )}
      </div>
    </div>
  );
};
