import { useAuthKit } from "@picahq/authkit";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";


export function AuthKitButton() {
  const { open } = useAuthKit({
    baseUrl: "https://inhotel-auth-integration-5ee4d3e488dd.herokuapp.com",
    token: {
      url: "https://platform-backend.inhotel.io/public/v1/event-links/create-embed-token",
      headers: { "X-Pica-Secret": "sk_test_1_3pejYG_SdSxV9xkt5_GA8WoMsSnfBHvY1qpGhlX-6DKd9kyZO3ee9hWfjGWpt5dY0AzxvM51q6_45_Q6bJTWCTuax7yq4X96nhvB0uTwhhLlsxyJm02JqasmdeDVeHt08GxGPoiBc7I9u00-1EKOejw62kNO0M1EaEFqwaGXw1Y8IfFH" },
    },
    onSuccess: (connection) => {},
    onError: (error) => {},
    onClose: () => {},
  });
  const MotionButton = motion(Button)
  return (
    <MotionButton 
      onClick={open}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-green-800/20 text-gray-400 hover:text-green-500 hover:border-green-500 hover:bg-green-900/20 transition-all duration-300 text-xs shadow-lg hover:shadow-green-900/20"
    >
      + New Connection
    </MotionButton>
  );
}